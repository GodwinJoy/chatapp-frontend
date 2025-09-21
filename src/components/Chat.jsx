import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../redux/chatSlice';
import { socket } from '../services/socket';

const Chat = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  const [isSet, setIsSet] = useState(false);
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    socket.on('message', (msg) => {
      dispatch(addMessage(msg));
    });
    return () => socket.off('message');
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      socket.emit('message', { user: username, text: input, timestamp });
      setInput('');
    }
  };

  const handleSetUsername = () => {
    if (username.trim()) {
      ;
      setIsSet(true);
    }
  };

  if (!isSet) {
    return (
      <div className="flex h-screen justify-center items-center bg-blue-300">
        <div className="bg-blue-100 p-8 rounded shadow-lg text-center rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Enter Your Username</h2>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="border w-full rounded mb-4 "  placeholder="Username" />
          <div>
            <button onClick={handleSetUsername} className="bg-blue-500 text-white py-2 rounded cursor-pointer"
          >Start Chat</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-400 p-4">
      <div className="bg-blue-100 w-full max-w-md p-6 rounded shadow-md flex flex-col">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">Real-Time Chat App</h2>
        <div className="flex-1 border rounded p-4 h-96  mb-4 bg-gray-50 flex flex-col space-y-2">
          {messages.map((msg, index) => {
            const isOwn = msg.user == username;
            return (
              <div key={index}
                className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                <div className=' px-4 py-2 rounded-lg' >
                  <span className="font-semibold" >{msg.user} </span>
                  <p className="text-gray-900">{msg.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1"> {msg.timestamp}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>
        <div className="flex">
          <input type="text"  value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message.." className="flex-1 border p-2 rounded-l "/>
          <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 cursor-pointer" >Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
