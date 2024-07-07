import React from 'react';
import { Paper, Typography } from '@material-ui/core';

function Message({ message, sender }) {
  const isUser = sender === 'user';
  return (
    <Paper
      elevation={3}
      style={{
        display: isUser ? 'block' : 'contents',
        padding: '16px',
        margin: '8px 0',
        backgroundColor: isUser ? '#e6f3ff' : 'rgb(255 255 255 / 0%)',
        textAlign: isUser ? 'right' : 'left',
        width: '100%', // Use full width
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        position: 'relative',
        borderRadius: '20px',
      }}
    >
      <Typography variant="body1" component="div">
        <div dangerouslySetInnerHTML={{ __html: message }} />
      </Typography>
    </Paper>
  );
}

export default Message;
