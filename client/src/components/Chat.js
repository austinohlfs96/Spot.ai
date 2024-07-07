import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Box } from '@material-ui/core';
import ResponseDisplay from './ResponseDisplay';
import Avatar from './Avatar';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Send introductory message on mount
  useEffect(() => {
    const introMessage = {
      content: "Hello! I'm Spot, your local expert. I'm here to help you find the best things to do, see, and eat in any location. Whether you're planning a trip or just looking for something fun to do in your own town, I've got you covered. I can even find you some great deals! How can I assist you today?",
      sender: 'ai',
    };
    setMessages([introMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = { content: message, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setLoading(true);

      const response = await fetch('http://localhost:5555/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      const aiMessage = { content: data.response, sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setLoading(false);
      setMessage('');
    }
  };

  return (
    <Container style={{padding: '0'}}>
      <div style={{ maxHeight: '600px', overflow: 'scroll' }}>
        <ResponseDisplay messages={messages} isLoading={loading} />
      </div>
      <Box mt={4}>
        <TextField
          label="Ask Spot..."
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
        <Box mt={2} textAlign="right">
          <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Chat;
