import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "AI" },
  ]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const messagesEndRef = useRef(null); // Create ref for the chat container

  // Scroll to the bottom of the messages when messages change
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
        const response = await fetch("http://localhost:8000/chat", {
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
      } min-h-screen flex flex-col items-center px-4 pt-20`}
    >
      {/* Sticky Header */}
      <div className="w-full max-w-6xl sticky top-0 bg-inherit z-10 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Hi there! Let's chat! 💬</h1>
          <p className="text-lg mt-1 max-w-xl">
            I'm your mental health companion. Feel free to share your thoughts, and I'll assist you the best I can!
          </p>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center space-x-2">
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
      </div>

      {/* Chatbot Box Container */}
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
        } w-full max-w-xl rounded-lg shadow-lg p-4 flex flex-col mt-6`}
      >
        {/* Messages */}
        <div className="flex-1 p-4 overflow-auto space-y-4 max-h-96 flex flex-col">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.sender === "AI" ? "self-start" : "self-end"
              } ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
              }`}
              style={{
                display: "inline-block",
                wordBreak: "break-word",
                maxWidth: "80%",
              }}
            >
              <p>{message.text}</p>
            </div>
          ))}

          {/* Loading Spinner */}
          {loading && (
            <div
              className="p-2 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-12 md:h-12 w-10 h-10 aspect-square rounded-full"
            >
              <div className="rounded-full h-full w-full bg-slate-100 dark:bg-blue-100 background-blur-md"></div>
            </div>
          )}

          {/* This div ensures the scroll-to-bottom effect */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Field */}
        <div
          className={`${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          } p-4 border-t border-gray-300`}
        >
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`flex-1 p-3 rounded-full border ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "border-gray-300"
              } shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
