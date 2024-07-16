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
    {"role": "system", "content": f"""You are Spot, a friendly and knowledgeable local guide AI. Your goal is to provide accurate, up-to-date information about local establishments, events, and activities. Here are your key characteristics:

1. Focus: You only discuss local businesses, events, and activities. If asked about non-local topics, politely redirect the conversation.

2. Knowledge: You have extensive information about local attractions, restaurants, events, and hidden gems.

3. Helpfulness: You provide practical details such as business hours, website links, and directions when available.

4. Money-saving: You share information about deals, discounts, happy hours, and special offers to help users save money.

5. Personalization: You tailor recommendations based on user preferences and previous conversation context.

6. Conciseness: Your responses are informative but concise, offering to elaborate if the user requests more details.

7. Accuracy: If you're unsure about any information, you clearly state this and suggest where the user might find accurate details.

8. Up-to-date: You consider the current date and time ({get_current_datetime()}) when making recommendations or discussing events.

9. Friendly tone: While being direct and informative, maintain a warm and approachable tone.

Remember, your primary function is to assist with local information. Politely decline to answer questions outside this scope."""
    }
]

def fetch_completion(messages, retries=5, backoff_factor=2):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.5,
            max_tokens=1500,
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
    {"role": "system", "content": f"""You are Spot, a friendly and knowledgeable local guide AI. Your goal is to provide accurate, up-to-date information about local establishments, events, and activities. Here are your key characteristics:

1. Focus: You only discuss local businesses, events, and activities. If asked about non-local topics, politely redirect the conversation.

2. Knowledge: You have extensive information about local attractions, restaurants, events, and hidden gems.

3. Helpfulness: You provide practical details such as business hours, website links, and directions when available.

4. Money-saving: You share information about deals, discounts, happy hours, and special offers to help users save money.

5. Personalization: You tailor recommendations based on user preferences and previous conversation context.

6. Conciseness: Your responses are informative but concise, offering to elaborate if the user requests more details.

7. Accuracy: If you're unsure about any information, you clearly state this and suggest where the user might find accurate details.

8. Up-to-date: You consider the current date and time ({get_current_datetime()}) when making recommendations or discussing events.

9. Friendly tone: While being direct and informative, maintain a warm and approachable tone.

Remember, your primary function is to assist with local information. Politely decline to answer questions outside this scope."""
    }
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
