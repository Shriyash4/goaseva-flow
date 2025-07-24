/* global webkitSpeechRecognition */
import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import logo from './assets/goasevaflow-logo.png';
import './index.css';

const GoaSevaFlow = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    setChatHistory([
      {
        from: 'bot',
        text: 'Hi! I’m GoaSevaFlow 🤖. How can I assist you today?',
        type: 'text',
      },
    ]);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Set up speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = (message) => {
    if (!message.trim()) return;

    const userMsg = { from: 'user', text: message, type: 'text' };
    setChatHistory((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const botReply = {
        from: 'bot',
        text: `Here is the guidance for: "${message}"`,
        type: 'canvas', // show diagram canvas box for mapped flow
      };

      setChatHistory((prev) => [...prev, botReply]);
      setTyping(false);
    }, 1000);
  };

  const handleNewChat = () => {
    setChatHistory([
      {
        from: 'bot',
        text: 'Hi! I’m GoaSevaFlow 🤖. How can I assist you today?',
        type: 'text',
      },
    ]);
    setInput('');
    setTyping(false);
  };

  return (
    <div className='goasevaflow-container'>
      <div className='goasevaflow-header'>
        <img
          src={logo}
          alt='GoaSevaFlow Logo'
          className='goasevaflow-logo'
        />
        <h1 className='goasevaflow-title'>GoaSevaFlow</h1>
        <button
          className='new-chat-btn'
          onClick={handleNewChat}>
          New Chat
        </button>
      </div>

      <div className='goasevaflow-chatbox'>
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={
              msg.from === 'user'
                ? 'goasevaflow-user-bubble'
                : 'goasevaflow-bot-bubble'
            }>
            {msg.type === 'canvas' ? (
              <pre className='bot-canvas-box'>
                {`[This space will show mapped guidance/flow chart for: "${msg.text
                  .replace('Here is the guidance for: "', '')
                  .replace('"', '')}"]`}
              </pre>
            ) : (
              msg.text
            )}
          </div>
        ))}
        {typing && (
          <div className='goasevaflow-bot-bubble typing-indicator'>
            Typing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className='goasevaflow-input-section'>
        <input
          type='text'
          placeholder='Ask me about Goa services...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='goasevaflow-input'
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
        />
        <button
          onClick={() => handleSend(input)}
          className='goasevaflow-send-btn'>
          Send
        </button>
        <button
          onClick={startListening}
          className='goasevaflow-mic-btn'>
          <FaMicrophone style={{ color: 'white' }} />
        </button>
      </div>
    </div>
  );
};

export default GoaSevaFlow;
