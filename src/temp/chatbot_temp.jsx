import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "AI" },
  ]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSendMessage = async () => {
  if (input.trim() !== "") {
    const userMessage = { text: input, sender: "User" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

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
    }
  }
};


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      handleSendMessage();
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen flex flex-col items-center px-4 pt-20`}>
      
      {/* Sticky Header */}
      <div className="w-full max-w-6xl sticky top-0 bg-inherit z-10 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">
            Hi there! Let's chat! 💬
          </h1>
          <p className="text-lg mt-1 max-w-xl">
            I'm your mental health companion. Feel free to share your thoughts, and I'll assist you the best I can!
          </p>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Dark Mode</label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="w-5 h-5"
          />
        </div>
      </div>

      {/* Chatbot Box Container */}
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col mt-6">
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-auto space-y-4 max-h-96 flex flex-col">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
              } self-${message.sender === "AI" ? "start" : "end"}`}
              style={{
                display: "inline-block",
                wordBreak: "break-word",
                maxWidth: "80%",
              }}
            >
              <p>{message.text}</p>
            </div>
          ))}
        </div>

        {/* Input Field */}
        <div className={`${darkMode ? "bg-gray-700" : "bg-gray-200"} p-4 border-t border-gray-300`}>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`flex-1 p-3 rounded-lg border ${
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
