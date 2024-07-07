import React, { useState } from 'react';
import { TextField, Button, Box } from '@material-ui/core';
import axios from 'axios';

function QuestionForm({ setResponse }) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5555/ask', { message });
      setResponse(res.data.response);
    } catch (error) {
      setResponse('Error fetching response. Please try again later.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Ask a question about your destination"
        fullWidth
        margin="normal"
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit" variant="contained" color="primary">
        Ask
      </Button>
    </Box>
  );
}

export default QuestionForm;
