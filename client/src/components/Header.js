import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import PetsIcon from '@material-ui/icons/Pets';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    textAlign: 'center',
  },
  icon: {
    color: 'yellow',
    marginLeft: theme.spacing(1),
  },
  appBar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function Header() {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Ask Spot!
          <PetsIcon className={classes.icon} style={{color: 'rgb(101, 156, 231)'}}/>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
