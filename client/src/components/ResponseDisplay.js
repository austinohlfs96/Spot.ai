import React from 'react';
import { Box, Typography, CircularProgress } from '@material-ui/core';
import Message from './Message';
import Avatar from './Avatar';

function ResponseDisplay({ messages = [], isLoading }) {
  // Get the most recent messages from user and AI
  const recentUserMessage = messages.filter(msg => msg.sender === 'user').slice(-1)[0];
  const recentAiMessage = messages.filter(msg => msg.sender === 'ai').slice(-1)[0];

  return (
    <Box mt={4} style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', backgroundColor: '#4F8EDB' }}>
      <Box style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', width: '100%' }}>
        {/* Display the user's message below the avatar */}
        {recentUserMessage && (
          <Box style={{ width: 'auto', display: 'flex', alignSelf: 'flex-start', marginBottom: '20px', marginLeft: '20px', marginTop: '20px' }}>
            <Message key={recentUserMessage.id} message={recentUserMessage.content} sender={recentUserMessage.sender} />
          </Box>
        )}

        {/* Display the avatar */}
        <Avatar />

        {/* Display the AI's message above the avatar */}
        <Box 
          style={{ 
            position: 'relative', 
            display: 'inline-block', 
            textAlign: 'left',
            backgroundColor: '#f8f9fa',
            padding: '15px 25px',
            borderRadius: '15px',
            marginTop: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            maxWidth: '100%',
            wordWrap: 'break-word',
            alignSelf: 'flex-end',
            margin: '20px',
          }}
        >
          {isLoading ? (
            <Typography variant="body1" style={{ color: '#333' }}>
              Thinking...
            </Typography>
          ) : (
            recentAiMessage && (
              <Typography variant="body1" style={{ color: '#333' }}>
                <Message message={recentAiMessage.content} sender={recentAiMessage.sender} />
              </Typography>
            )
          )}
          <Box
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: '60px',
              width: '0',
              height: '0',
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid #f8f9fa',
              alignSelf: 'flex-end',
            }}
          />
        </Box>

        {/* Display a thought bubble if loading */}
        {isLoading && (
          <Box
            style={{
              position: 'absolute',
              top: '-80px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#f8f9fa',
              padding: '10px 20px',
              borderRadius: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CircularProgress size={24} />
            <Typography variant="body2" style={{ marginLeft: '10px' }}>
              Thinking...
            </Typography>
            <Box
              style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                width: '0',
                height: '0',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '10px solid #f8f9fa',
                transform: 'translateX(-50%)',
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ResponseDisplay;
