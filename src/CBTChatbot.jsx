import React, { useState, useEffect, useRef } from 'react';
import { Heart, Send, Star, Brain, MessageCircle, TrendingUp, User, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';

const CBTChatbot = () => {
  const [currentView, setCurrentView] = useState('mood'); // 'mood', 'chat', 'feedback'
  const [error, setError] = useState(null);
  const [mood, setMood] = useState(5);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('Friend');
  const [currentSession, setCurrentSession] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Base API URL - adjust this to match your backend
  const API_BASE_URL = 'http://localhost:8000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const moodEmojis = {
    1: '😢', 2: '😔', 3: '😕', 4: '😐', 5: '😊',
    6: '🙂', 7: '😄', 8: '😃', 9: '😁', 10: '🤩'
  };

  const moodLabels = {
    1: 'Very Low', 2: 'Low', 3: 'Down', 4: 'Below Average', 5: 'Neutral',
    6: 'Good', 7: 'Happy', 8: 'Great', 9: 'Excellent', 10: 'Amazing'
  };

  const handleMoodSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/cbt/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUserName(data.user_name);
        setWelcomeMessage(data.welcome_message);
        setMessages([{
          id: Date.now(),
          type: 'bot',
          content: data.welcome_message,
          timestamp: new Date().toISOString()
        }]);
        setCurrentView('chat');
      } else {
        setError(data.error || 'Failed to submit mood');
        console.error('Error submitting mood:', data.error);
      }
    } catch (error) {
      setError(`Connection error: ${error.message}`);
      console.error('Error submitting mood:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/cbt/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentMessage,
          mood: mood 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.response,
          analysis: data.analysis,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setCurrentSession(data.session_date);
      } else {
        setError(data.error || 'Failed to get response');
        console.error('Error in chat:', data.error);
      }
    } catch (error) {
      setError(`Connection error: ${error.message}`);
      console.error('Error in chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (score) => {
    if (!currentSession) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cbt/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_date: currentSession,
          score: score
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCurrentView('feedback');
      } else {
        console.error('Error submitting feedback:', data.error);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const renderMoodView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MAHI</h1>
          <p className="text-gray-600">Mental Health AI Assistant</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            How are you feeling today?
          </h2>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-center">
                <div className="text-red-600 text-sm">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-center mb-4">
            <div className="text-6xl">
              {moodEmojis[mood]}
            </div>
          </div>
          
          <div className="text-center mb-4">
            <span className="text-lg font-medium text-gray-700">
              {moodLabels[mood]} ({mood}/10)
            </span>
          </div>

          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
              }}
            />
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>Very Low</span>
              <span>Neutral</span>
              <span>Amazing</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleMoodSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Starting Session...
            </div>
          ) : (
            'Start Chat Session'
          )}
        </button>
      </div>
    </div>
  );

  const renderChatView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header - Fixed positioning to avoid navbar overlap */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 sticky top-20 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">MAHI</h1>
                <p className="text-sm text-gray-500">Your CBT Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Heart className="w-4 h-4" />
              <span>Mood: {moodLabels[mood]}</span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white rounded-2xl shadow-lg flex flex-col h-96 mb-4">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="text-red-600 text-sm">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.analysis && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs space-y-1">
                        <div><strong>Pattern:</strong> {msg.analysis.distortion}</div>
                        <div><strong>Reframe:</strong> {msg.analysis.reframe}</div>
                      </div>
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span className="text-sm">MAHI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share what's on your mind..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit();
                  }
                }}
              />
              <button
                onClick={handleChatSubmit}
                disabled={isLoading || !message.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        {currentSession && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">How helpful was this session?</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => handleFeedback(score)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{score}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderFeedbackView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <ThumbsUp className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
        <p className="text-gray-600 mb-6">
          Your feedback helps MAHI provide better support. Remember, you're making progress with each session.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setCurrentView('mood')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start New Session
          </button>
          <button
            onClick={() => setCurrentView('chat')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
          >
            Continue Current Session
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      {currentView === 'mood' && renderMoodView()}
      {currentView === 'chat' && renderChatView()}
      {currentView === 'feedback' && renderFeedbackView()}
    </div>
  );
};

export default CBTChatbot;