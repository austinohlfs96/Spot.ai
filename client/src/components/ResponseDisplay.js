import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography } from '@material-ui/core';
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
        console.log(mouthRect);
        setCoords({
          x: mouthRect.left, // Adjust for bone width
          y: mouthRect.top  // Adjust for bone height
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
    <Box mt={4} style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', backgroundColor: '#4F8EDB' }}>
      <Box style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', width: '100%', position: 'relative' }}>
        {recentUserMessage && (
          <Box style={{ width: 'auto', display: 'flex', alignSelf: 'flex-start', marginBottom: '20px', marginLeft: '20px', marginTop: '20px' }}>
            <Message key={recentUserMessage.id} message={recentUserMessage.content} sender={recentUserMessage.sender} />
          </Box>
        )}

        <div ref={mouthRef} style={{ position: 'relative' }}>
          <Avatar />
        </div>

        <Bone isThrown={isThrown} x={coords.x} y={coords.y} />

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
          <div>
            {isLoading ? (
              <Typography variant="body1" style={{ color: '#333', minWidth: '80px' }}>
                Thinking<span className="ellipsis"></span>
              </Typography>
            ) : (
              recentAiMessage && (
                <Typography variant="body1" style={{ color: '#333' }}>
                  <Message message={recentAiMessage.content} sender={recentAiMessage.sender} />
                </Typography>
              )
            )}
          </div>
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
      </Box>
    </Box>
  );
}

export default ResponseDisplay;
