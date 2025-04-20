import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import Message from './Message';
import Avatar from './Avatar';
import Bone from './Bone';

function ResponseDisplay({ messages = [], isLoading, isThrown }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const mouthRef = useRef(null);

  useEffect(() => {
    const updateCoordinates = () => {
      if (mouthRef.current) {
        const mouthRect = mouthRef.current.getBoundingClientRect();
        setCoords({
          x: mouthRect.left,
          y: mouthRect.top
        });
      }
    };
    updateCoordinates();
    window.addEventListener('resize', updateCoordinates);
    return () => window.removeEventListener('resize', updateCoordinates);
  }, [isThrown]);

  const recentUserMessage = messages.filter(msg => msg.sender === 'user').slice(-1)[0];
  const recentAiMessage = messages.filter(msg => msg.sender === 'ai').slice(-1)[0];

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', backgroundColor: '#4F8EDB', padding: '20px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', width: '100%', position: 'relative' }}>
        {recentUserMessage && (
          <Box sx={{ width: 'auto', display: 'flex', alignSelf: 'flex-start', marginBottom: '20px', marginLeft: '20px', marginTop: '20px' }}>
            <Message key={recentUserMessage.id} message={recentUserMessage.content} sender={recentUserMessage.sender} />
          </Box>
        )}

        <div ref={mouthRef} style={{ position: 'relative' }}>
          <Avatar />
        </div>

        <Bone isThrown={isThrown} x={coords.x} y={coords.y} />

        <Box 
          sx={{ 
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
            overflowX: 'auto'
          }}
        >
          <div>
            {isLoading ? (
              <Typography variant="body1" sx={{ color: '#333', minWidth: '80px' }}>
                Thinking<span className="ellipsis"></span>
              </Typography>
            ) : (
              recentAiMessage && (
                <Typography variant="body1" sx={{ color: '#333' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {recentAiMessage.content}
                  </ReactMarkdown>
                </Typography>
              )
            )}
          </div>
          <Box
            sx={{
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
      </Box>
    </Box>
  );
}

export default ResponseDisplay;
