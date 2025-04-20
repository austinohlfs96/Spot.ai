import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Box } from '@material-ui/core';
import ResponseDisplay from './ResponseDisplay';


const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isThrown, setIsThrown] = useState(false);
  const [isTTSOn, setIsTTSOn] = useState(false); // TTS toggle state



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
  //   if (isTTSOn) handleTextToSpeech(introMessage.content); // Speak the intro message only if TTS is on
  // }, [isTTSOn]);
  })

  // const handleTextToSpeech = (text) => {
  //   // Remove HTML tags
  //   let strippedText = text.replace(/<\/?[^>]+(>|$)/g, '');
  
  //   // Remove Markdown formatting
  //   strippedText = strippedText
  //     .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
  //     .replace(/(\*|_)(.*?)\1/g, '$2') // Italic
  //     .replace(/~~(.*?)~~/g, '$1') // Strikethrough
  //     .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
  //     .replace(/!\[(.*?)\]\(.*?\)/g, '') // Images
  //     .replace(/#+\s*(.*)/g, '$1') // Headers
  //     .replace(/>\s*(.*)/g, '$1') // Blockquotes
  //     .replace(/`{1,2}([^`]+)`{1,2}/g, '$1'); // Inline code
  
  //   const utterance = new SpeechSynthesisUtterance(strippedText);
  //   utterance.voice = window.speechSynthesis.getVoices().find(voice => voice.lang === 'en-US');
  //   window.speechSynthesis.speak(utterance);
  // };

  // const handleTextToSpeech = async (text) => {
  //   if (!isTTSOn) return; // Exit if TTS is off
  //   let strippedText = text.replace(/<\/?[^>]+(>|$)/g, '');
  
  //   // Remove Markdown formatting
  //   strippedText = strippedText
  //     .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
  //     .replace(/(\*|_)(.*?)\1/g, '$2') // Italic
  //     .replace(/~~(.*?)~~/g, '$1') // Strikethrough
  //     .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
  //     .replace(/!\[(.*?)\]\(.*?\)/g, '') // Images
  //     .replace(/#+\s*(.*)/g, '$1') // Headers
  //     .replace(/>\s*(.*)/g, '$1') // Blockquotes
  //     .replace(/`{1,2}([^`]+)`{1,2}/g, '$1'); // Inline code
    // const apiKey = 'sk_18ace37fd0d8ac72620a1dc62c05dc089fd7aba629ab8631'; // Replace with your actual API key
    // const voiceId = 'bIHbv24MWmeRgasZH58o'; // Replace with the voice ID you want to use
  
    // const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'xi-api-key': apiKey,
    //   },
    //   body: JSON.stringify({
    //     text: text,
    //     voice_settings: {
    //       stability: 0.5,
    //       similarity_boost: 0.75,
    //     },
    //   }),
    // });
  
  //   if (response.ok) {
  //     const audioBlob = await response.blob();
  //     const audioUrl = URL.createObjectURL(audioBlob);
  //     const audio = new Audio(audioUrl);
  //     audio.play();
  //   } else {
  //     console.error('Error fetching TTS from ElevenLabs:', response.statusText);
  //   }
  // };
  
  

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = { content: message, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setLoading(true);

      const response = await fetch('http://127.0.0.1:5555/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      

      const data = await response.json();
      const aiMessage = { content: data.response, sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      // handleTextToSpeech(aiMessage.content); // Speak the AI's response
      setLoading(false);
      setMessage('');
    }
  };

  const handleThrow = () => {
    setIsThrown(true);
    setTimeout(() => {
      setIsThrown(false);
    }, 1000);
  };

  const toggleTTS = () => {
    setIsTTSOn(!isTTSOn);
  };

  return (
    <Container style={{ padding: '0' }}>
      <ResponseDisplay messages={messages} isLoading={loading} isThrown={isThrown} />
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
      </Box>
      <Box mt={2} textAlign="right" style={{display: "flex", justifyContent: "space-around"}}>
        <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </Button>
        <Button variant="contained" color="secondary" onClick={handleThrow}>
          Throw Bone
        </Button>
        {/* <Button variant="contained" onClick={toggleTTS}>
          {isTTSOn ? 'Turn TTS Off' : 'Turn TTS On'}
        </Button> */}
      </Box>
    </Container>
  );
};

export default Chat;
