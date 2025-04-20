import React, { useState, useEffect, useCallback } from 'react';
import { Container, TextField, Button, Box } from '@mui/material';
import ResponseDisplay from './ResponseDisplay';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isThrown, setIsThrown] = useState(false);
  const [isTTSOn, setIsTTSOn] = useState(false); // TTS toggle state

  // Text-to-speech handler defined before useEffect
  const handleTextToSpeech = useCallback(async (text) => {
    if (!isTTSOn) return;

    const strippedText = text
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/!\[(.*?)\]\(.*?\)/g, '')
      .replace(/#+\s*(.*)/g, '$1')
      .replace(/>\s*(.*)/g, '$1')
      .replace(/`{1,2}([^`]+)`{1,2}/g, '$1');

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/bIHbv24MWmeRgasZH58o`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': 'sk_18ace37fd0d8ac72620a1dc62c05dc089fd7aba629ab8631', // Consider securing this key on the backend
      },
      body: JSON.stringify({
        text: strippedText,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      console.error('Error fetching TTS from ElevenLabs:', response.statusText);
    }
  }, [isTTSOn]);

  // Only runs on mount and when TTS is toggled
  useEffect(() => {
    const introMessage = {
      content: `Hi there! Try asking a question about SpotSurfer to get started.\n
      Here are a few things you can ask:\n
      • Where should I park for the GoPro Mountain Games?\n
      • How do I change or cancel a reservation?\n
      • Are there any discounts available today?\n
      • Which lot is closest to the ski lifts?\n
      \nWhat can I help you with?`,
      sender: 'ai',
    };
    setMessages([introMessage]);
    if (isTTSOn) handleTextToSpeech(introMessage.content);
  }, [isTTSOn, handleTextToSpeech]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = { content: message, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setLoading(true);

      try {
        const response = await fetch('http://127.0.0.1:5555/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });

        const data = await response.json();
        const aiMessage = { content: data.response, sender: 'ai' };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        handleTextToSpeech(aiMessage.content);
      } catch (error) {
        console.error('Failed to fetch AI response:', error);
      } finally {
        setLoading(false);
        setMessage('');
      }
    }
  };

  const handleThrow = () => {
    setIsThrown(true);
    setTimeout(() => setIsThrown(false), 1000);
  };

  const toggleTTS = () => {
    setIsTTSOn(!isTTSOn);
  };

  return (
    <Container sx={{ padding: 0 }}>
      <ResponseDisplay messages={messages} isLoading={loading} isThrown={isThrown} />
      <Box sx={{ mt: 4 }}>
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
      </Box>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
        <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </Button>
        <Button variant="contained" color="secondary" onClick={handleThrow}>
          Throw Bone
        </Button>
        <Button variant="contained" onClick={toggleTTS}>
          {isTTSOn ? 'Turn TTS Off' : 'Turn TTS On'}
        </Button>
      </Box>
    </Container>
  );
};

export default Chat;
