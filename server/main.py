import os
import logging
import openai
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from weather import WeatherService
from traffic import TrafficService
import markdown2

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load environment variables
load_dotenv()
weather_api_key = os.getenv('WEATHER_API_KEY')
maps_api_key = os.getenv('GOOGLE_MAPS_API_KEY')
openai.api_key = os.getenv('OPENAI_API_KEY')

# Initialize Flask app and enable CORS
app = Flask(__name__, static_folder='client/build', static_url_path='')
CORS(app)

# Initialize services
weather_service = WeatherService(weather_api_key)
traffic_service = TrafficService(maps_api_key)

# Load knowledge base
knowledge_base_path = 'knowledge_base.txt'

def load_knowledge_base():
    try:
        with open(knowledge_base_path, 'r') as f:
            return f.read()
    except Exception as e:
        logging.error(f"Error loading knowledge base: {e}")
        return ""

knowledge_base = load_knowledge_base()

# Query OpenAI with constructed prompt
def query_contextual_response(prompt):
    try:
        logging.info(f"Sending prompt to OpenAI:\n{prompt}")
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=700
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        logging.error(f"Error querying OpenAI: {e}")
        return "Sorry, I couldn't get the information right now. Please try again shortly."

def extract_origin_destination(text):
    import re
    match = re.search(r'from ([a-zA-Z\s]+?) to ([a-zA-Z\s]+?)(?:[\.,\?]|$)', text.lower())
    if match:
        origin = match.group(1).strip().title()
        destination = match.group(2).strip().title()
        return origin, destination
    return None, None

def generate_contextual_prompt(user_question, user_location=None, reservation_details=None):
    weather_info = ""
    traffic_info = ""
    location_info = ""

    if user_location:
        weather = weather_service.fetch_weather(user_location)
        if weather:
            weather_info += f"\nDetailed weather at your location ({user_location}):\n{weather_service.format_weather_info(weather, user_location)}\n"

    if reservation_details:
        destination = reservation_details.get('destination')
        reservation_date = reservation_details.get('date')

        if destination:
            weather = weather_service.fetch_weather(destination)
            if weather:
                weather_info += f"\nDetailed weather at your destination ({destination}):\n{weather_service.format_weather_info(weather, destination)}\n"

        if reservation_date:
            location_info += f"Reservation date: {reservation_date}\n"

    if "route" in user_question.lower() or "travel" in user_question.lower():
        key_stops = ["Parker", "Idaho Springs", "Silverthorne", "Vail"]
        weather_info += f"\nWeather along key stops:\n{weather_service.get_weather_along_route(key_stops)}"

    origin, destination = extract_origin_destination(user_question)
    if origin and destination:
        traffic_data = traffic_service.get_traffic_summary(origin, destination)
        traffic_info = traffic_service.format_traffic_info(traffic_data)

    prompt = f"""
You are Spot, the official AI assistant for SpotSurfer Parking.
Your job is to provide helpful, concise, and always SpotSurfer-focused parking advice, suggestions, and answers.

Use the following knowledge base, real-time weather, live traffic, and user context to help users make informed parking decisions and encourage them to book with SpotSurfer:

USER CONTEXT:
{location_info}

KNOWLEDGE BASE:
{knowledge_base}

{weather_info}
{traffic_info}

Question: {user_question}

Remember to:
- Include specific weather and traffic details when relevant
- Provide parking recommendations based on current travel conditions
- Always reference SpotSurfer parking options in your response

Answer:
"""
    return prompt

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.json
        message = data.get('message', '')
        user_location = data.get('user_location')
        reservation_details = data.get('reservation_details', {})

        prompt = generate_contextual_prompt(message, user_location, reservation_details)
        ai_response = query_contextual_response(prompt)

        html_response = markdown2.markdown(ai_response)

        return jsonify({
            "response": ai_response,
            "html": html_response,
            "status": "success"
        })
    except Exception as e:
        logging.error(f"Error handling /ask request: {e}")
        return jsonify({
            "response": "There was an error processing your request.",
            "status": "error"
        }), 500

@app.route('/')
def serve_index():
    index_path = os.path.join(app.static_folder, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({
        "error": "Frontend not built. Run `npm run build --prefix client`"
    }), 500

@app.errorhandler(404)
def serve_fallback(e):
    index_path = os.path.join(app.static_folder, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({
        "error": "Frontend not built. Run `npm run build --prefix client`"
    }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555)
