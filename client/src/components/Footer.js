import React from 'react';
import { Box, Typography, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StackIcon from 'tech-stack-icons';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0),
  },
  heart: {
    color: 'red',
  },
  link: {
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
}));

function Footer() {
  const classes = useStyles();

  return (
    <Box className={classes.footer} mt={5}>
      
      <Typography variant="body2" color="textSecondary" align="center">
        {'Coded with '}
        <span className={classes.heart}>❤️</span>
        {' by '}
        <Link href="http://austinohlfs.com" className={classes.link}>
          Austin Ohlfs
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        {'© '}
        {new Date().getFullYear()}
        {' Spot. All rights reserved.'}
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Powered by '}
        <StackIcon name='openai' title='openai' style={{ width: '20px', height: '20px' }}/>
      </Typography>
    </Box>
  );
}

export default Footer;
