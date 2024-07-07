// App.js
import React from 'react';
import { Container } from '@material-ui/core';
import Chat from './components/Chat';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Container style={{padding: '0'}}>
      <Header/>
      <Chat />
      <Footer/>
    </Container>
  );
}

export default App;
