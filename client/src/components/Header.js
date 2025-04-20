import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const useStyles = styled((theme) => ({
  title: {
    flexGrow: 1,
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    textAlign: 'center',
  },
  icon: {
    color: 'yellow',
    marginLeft: theme.spacing(1),
  },
}));

function Header() {
  const classes = useStyles();

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Ask Spot!
          <PetsIcon className={classes.icon} style={{color: 'rgb(101, 156, 231)'}}/>
        </Typography>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Header;
