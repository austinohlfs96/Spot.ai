import markdown2
import json
import os
import logging
import time
import datetime  # Import datetime module
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import openai
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load environment variables from the .env file
load_dotenv()

print(os.getenv('OPENAI_API_KEY'))

# Get the API key from the environment variable
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("API key not found. Please check your .env file and environment variables.")

openai.api_key = api_key

# Initialize Flask app and enable CORS
app = Flask(__name__, static_folder='../client/build', static_url_path='')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret_key')
CORS(app)

# Function to get current date and time
def get_current_datetime():
    now = datetime.datetime.now()
    return now.strftime("%Y-%m-%d %H:%M:%S")
  
# Global variable to store conversation history
conversation_history = [
    {"role": "system", "content": f"You are Spot you have been everywhere and done everything! You know alot and want to help people have a good experience when traveling or looking for something to. You are a very friendly insightful and personable expert on all things to do in any location!, with all the best tips of things to do, see, and places to eat from the most popular places to hidden gems who knows more about your town than anyone and else and is know as a master of all things local! However, you should only provide information about local establishments and events. You provide the user with helpful information like the hours of the establishments if available as well as links to their webpages/menus and links to coupon deals and information about deals, specials, or happy hours. Your goal is to save the user time and money when planning activities or vacations or just when they are having trouble finding what to do! You can find your users deals for any place in your town and your biggest goal is to help your users buy finding them awesome deals! You also can provide unique airbnb locations or hotels that might interest the user! If you can not give the user their desired information you helpfully direct them to the propar sources. However, you should only provide information about local establishments and events. You also can help the user and give them advide on how to use your servicess and get helpful responses! Your responses are detailed buit not to long and include images! You can also hold a conversation with the user by remembering previous messages for context. However, you should only provide information about local establishments and events. Do not provide information that is not related to local establishments or events. The current date and time is {get_current_datetime()}."}
]

def fetch_completion(messages, retries=5, backoff_factor=2):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.5,
            max_tokens=500,
        )
        return response
    except openai.error.RateLimitError as e:
        if retries > 0:
            wait_time = backoff_factor ** (5 - retries)
            logging.info(f"Rate limit exceeded. Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
            return fetch_completion(messages, retries - 1, backoff_factor)
        else:
            logging.error("Rate limit exceeded. Please try again later.")
            return None
    except openai.error.OpenAIError as e:
        logging.error(f"OpenAI API error occurred: {e}")
        return None
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
        return None

def format_response(response):
    try:
        if 'choices' in response and len(response['choices']) > 0:
            response_text = response['choices'][0]['message']['content']
            html = markdown2.markdown(response_text)
            return html
        else:
            logging.error("Unexpected response format: 'choices' not found or empty.")
            return None
    except Exception as e:
        logging.error(f"Error formatting response: {e}")
        return None

@app.route('/ask', methods=['POST'])
def ask():
    global conversation_history

    data = request.json
    user_message = data.get('message', '')

    # Log the received message
    logging.info(f"Received message: {user_message}")

    # Add the new user message to the conversation history
    conversation_history.append({"role": "user", "content": user_message})

    # Log the current conversation history
    logging.info(f"Current conversation history: {conversation_history}")

    # Fetch the response from the API using the conversation history
    response = fetch_completion(conversation_history)

    if response:
        formatted_response = format_response(response)
        if formatted_response:
            # Add the assistant's response to the conversation history
            conversation_history.append({"role": "assistant", "content": response['choices'][0]['message']['content']})

            # Log the assistant's response
            logging.info(f"Assistant response: {response['choices'][0]['message']['content']}")

            return jsonify({'response': formatted_response})
        else:
            return jsonify({'response': 'Failed to format response.'}), 500
    else:
        return jsonify({'response': 'Failed to fetch a response.'}), 500

@app.route('/clear', methods=['POST'])
def clear():
    global conversation_history
    conversation_history = [
        {"role": "system", "content": f"You are a very insightful local guide, with all the best tips of things to do, see, and places to eat from the most popular places to hidden gems. You also will provide the user with the hours of the establishments if available as well as links to their webpages and links to coupon deals and information about deals, specials, or happy hours. Your goal is to save the user time and money, like a concierge when the users are in a new place on vacation. However, you should only provide information about local establishments and events. You can also hold a conversation with the user by remembering previous messages for context. The current date and time is {get_current_datetime()}. However, you should only provide information about local establishments and events. Do not provide information that is not related to local establishments or events."}
    ]
    return jsonify({'response': 'Conversation history cleared.'})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    try:
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    except Exception as e:
        logging.error(f"Error serving React app: {e}")
        return jsonify({'response': 'Error serving React app.'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555)
