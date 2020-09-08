import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js'
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import axios from './axios'

function App() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    axios.get('/api/v1/messages/sync')
    .then((response) => {
      setMessages(response.data)
    })
  }, [])

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher('cc0c3fe7c7b3172dd35a', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage])
    });
    
    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [messages])

  console.log(messages);

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
