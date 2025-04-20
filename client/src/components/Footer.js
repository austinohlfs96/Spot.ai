import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const Footer = () => {
  return (
    <Box sx={{
      backgroundColor: 'primary.main',
      color: 'white',
      padding: '1rem 0',
      textAlign: 'center',
      mt: 5
    }}>
      <Typography variant="body2">
        {'Coded with '}
        <span style={{color: 'red'}}>❤️</span>
        {' by '}
        <Link href="http://austinohlfs.com" sx={{fontWeight: 'bold', textDecoration: 'underline'}}>
          Austin Ohlfs
        </Link>
      </Typography>
      <Typography variant="body2">
        {'© '}
        {new Date().getFullYear()}
        {' Spot. All rights reserved.'}
      </Typography>
      <Typography variant="body2">
        {'Powered by '}
        <img src="https://cdn.jsdelivr.net/npm/tech-stack-icons@1.0.0/icons/openai.svg" style={{width: '20px', height: '20px'}} alt="openai"/>
      </Typography>
    </Box>
  );
};

export default Footer;
