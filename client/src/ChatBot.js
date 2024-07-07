// src/ChatBot.js
import React, { useState } from 'react';

function ChatBot() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5555/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await res.json();
            setResponse(data.response);
        } catch (error) {
            setResponse('Error: ' + error.message);
        }
    };

    return (
      <div className="chat-container">
      <h1>AI ChatBot</h1>
      <form onSubmit={handleSubmit} className="chat-form">
          <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question..."
              className="chat-input"
          />
          <button type="submit" className="chat-submit">Ask</button>
      </form>
            <p style={{color: 'black'}}>{response}</p>
        </div>
    );
}

export default ChatBot;
