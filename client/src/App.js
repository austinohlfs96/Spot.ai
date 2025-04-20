// App.js
import React from 'react';
import { Container } from '@mui/material';
import Chat from './components/Chat';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Container style={{padding: '0'}}>
      <Header/>
      <Chat />
      <Footer style={{marginTop: '10px'}}/>
    </Container>
  );
}

export default App;
