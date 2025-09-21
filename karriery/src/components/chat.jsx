import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI Career Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const responses = {
      'help': "I can assist you with career advice, job search strategies, skill development recommendations, and more!",
      'jobs': "I recommend checking our job board and setting up job alerts. What type of role are you looking for?",
      'skills': "Great question! Based on current market trends, I suggest focusing on: React, TypeScript, Python, and cloud technologies. Would you like specific learning resources?",
      'resume': "I can help you optimize your resume! Key tips: Use action verbs, quantify achievements, tailor to each job, and keep it concise. Would you like me to review yours?",
      'interview': "Interview prep is crucial! Practice common questions, research the company, prepare STAR method examples, and dress appropriately. Need specific tips?",
      'salary': "Salary negotiation starts with research. Know your worth, have a range ready, and highlight your value. What role are you negotiating for?",
      'network': "Networking is key! Attend industry events, join professional groups, engage on LinkedIn, and follow up with connections. Need networking strategies?",
      'default': "I understand you're asking about career development. Could you be more specific? I can help with jobs, skills, interviews, networking, and more!"
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (key !== 'default' && lowerMessage.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <i className="fas fa-robot"></i>
        AI Career Assistant
      </div>
      
      <div className="chat-messages">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.sender}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.text}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            className="message bot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me about your career..."
          disabled={isTyping}
        />
        <motion.button 
          type="submit"
          disabled={isTyping || !inputValue.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-paper-plane"></i>
        </motion.button>
      </form>
    </div>
  );
};

export default Chat;