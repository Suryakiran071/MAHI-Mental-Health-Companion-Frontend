import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";

// Import the original Particles component
import Particles from './Components/Particles';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "AI" },
  ]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() !== "") {
      const userMessage = { text: input, sender: "User" };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true); // Set loading to true when waiting for response

      try {
        const response = await fetch("http://localhost:8000/chatbot/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_input: input }),
        });

        const data = await response.json();

        const aiMessage = {
          text: data.response,
          sender: "AI",
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { text: "Error: Could not reach the backend.", sender: "AI" },
        ]);
      } finally {
        setLoading(false); // Set loading to false once the response is received
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      handleSendMessage();
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } min-h-screen flex relative overflow-hidden`}
    >
      {/* Particle Background */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0
      }}>
        <Particles
          particleColors={['#008000', '#008000']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Dark Mode Toggle - Fixed Position */}
      <div className="fixed top-20 mt-5 mr-5 right-4 z-20">
        <label className="relative inline-block w-16 h-8">
          <input
            type="checkbox"
            className="absolute opacity-0 w-0 h-0 peer"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="absolute inset-0 cursor-pointer bg-blue-300 rounded-full transition-colors duration-300 peer-checked:bg-blue-900"></span>
          
          {/* White circle moving above the icons */}
          <span
            className={`absolute top-1 left-1 z-20 w-6 h-6 bg-white rounded-full transition-all duration-300 transform ${
              darkMode ? "translate-x-8" : "translate-x-0"
            }`}
          />
          
          {/* Moon Icon - Fixed left */}
          <span className="absolute top-1 left-1 z-10 text-blue-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 384 512"
            >
              <path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
            </svg>
          </span>
          
          {/* Sun Icon - Fixed right */}
          <span className="absolute top-1 right-1 z-10 text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <g fill="#ffd43b">
                <circle r="5" cy="12" cx="12"></circle>
                <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path>
              </g>
            </svg>
          </span>
        </label>
      </div>

      {/* Left Side - Header and Subtitle */}
      <div className="w-1/2 flex flex-col justify-center items-start px-8 lg:px-12 relative z-10">
        <div className="max-w-lg ml-10">
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Your Mental Health Companion
          </h1>
          <p className="text-xl lg:text-2xl leading-relaxed opacity-90">
            A safe, judgment-free space to share your thoughts and feel heard. I'm here to support you — anytime, anywhere.
          </p>
        </div>
      </div>

      {/* Right Side - Chatbot */}
      <div className="w-1/2 mt-20 flex flex-col justify-center items-center px-8 lg:px-12 relative z-10">
        <div
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } w-full max-w-lg rounded-2xl shadow-2xl flex flex-col h-[600px]`}
          style={{ 
            backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Chat Header */}
          <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-t-2xl border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
            <h3 className="text-lg font-semibold text-center">Mental Health Support</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "AI" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-xs ${
                    message.sender === "AI" 
                      ? darkMode 
                        ? "bg-gray-700 text-white" 
                        : "bg-gray-100 text-gray-800"
                      : "bg-green-500 text-white"
                  }`}
                  style={{
                    wordBreak: "break-word",
                  }}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}

            {/* Loading Spinner */}
            {loading && (
              <div className="flex justify-start">
                <div className="p-1 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 w-8 h-8 aspect-square rounded-full">
                  <div className="rounded-full h-full w-full bg-slate-100 dark:bg-blue-100 background-blur-md"></div>
                </div>
              </div>
            )}

            {/* This div ensures the scroll-to-bottom effect */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            } p-4 border-t ${darkMode ? "border-gray-600" : "border-gray-200"} rounded-b-2xl`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`flex-1 p-3 rounded-full border ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 placeholder-gray-500"
                } shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all`}
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;