import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Adjust path as needed
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const MentalHealthResources = () => {
  // State to handle journal responses
  const [responses, setResponses] = useState({
    prompt1: "",
    prompt2: "",
  });

  // State for mood classification and resources
  const [currentMood, setCurrentMood] = useState('');
  const [resources, setResources] = useState({
    apps: [],
    books: [],
    journal_prompts: [],
    quotes: [],
    videos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to classify mood from backend
  const classifyMood = async () => {
    try {
      const response = await fetch('http://localhost:8000/classify/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId
        })
      });

      if (!response.ok) {
        // If no mood logs found, default to a neutral mood instead of throwing error
        if (response.status === 404) {
          return 'Neutral';
        }
        
        const errorText = await response.text();
        throw new Error(`Failed to classify mood: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.predicted_mood;
    } catch (error) {
      throw error;
    }
  };

  // Function to fetch resources from Firestore based on mood
  const fetchResourcesFromFirestore = async (mood) => {
    try {
      const resourcesRef = collection(db, 'mood_resources');
      const q = query(resourcesRef, where('mood', '==', mood));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const resourceData = querySnapshot.docs[0].data();
        // Access the nested 'resources' field
        const resources = resourceData.resources || resourceData;
        return resources;
      } else {
        // If no resources found for specific mood, fetch neutral resources
        const neutralQuery = query(resourcesRef, where('mood', '==', 'Neutral'));
        const neutralSnapshot = await getDocs(neutralQuery);
        
        if (!neutralSnapshot.empty) {
          const neutralData = neutralSnapshot.docs[0].data();
          // Access the nested 'resources' field for neutral data too
          const neutralResources = neutralData.resources || neutralData;
          return neutralResources;
        }
        
        return null;
      }
    } catch (error) {
      throw error;
    }
  };

  // Load mood and resources when userId is available
  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadMoodAndResources = async () => {
      try {
        setLoading(true);
        
        // Classify mood
        const mood = await classifyMood();
        setCurrentMood(mood);

        // Fetch resources based on mood
        const resourceData = await fetchResourcesFromFirestore(mood);
        
        if (resourceData) {
          setResources({
            apps: resourceData.apps || [],
            books: resourceData.books || [],
            journal_prompts: resourceData.journal_prompts || [],
            quotes: resourceData.quotes || [],
            videos: resourceData.videos || []
          });
        }

        setLoading(false);
      } catch (error) {
        setError(`Failed to load personalized resources: ${error.message}`);
        setCurrentMood('Neutral');
        setLoading(false);
      }
    };

    loadMoodAndResources();
  }, [userId]);

  // Handle input changes for journal responses
  const handleInputChange = (e, prompt) => {
    setResponses({
      ...responses,
      [prompt]: e.target.value,
    });
  };

  // Handle journal submission
  const handleJournalSubmit = () => {
    console.log("User's journal responses:", responses);
    // Process or store these responses
  };

  // Function to get mood color
  const getMoodColor = (mood) => {
    const moodColors = {
      'Happy': 'text-yellow-500',
      'Excited': 'text-orange-500',
      'Grateful': 'text-green-500',
      'Motivated': 'text-blue-500',
      'Hopeful': 'text-purple-500',
      'Inspired': 'text-pink-500',
      'Neutral': 'text-gray-500',
      'Sad': 'text-blue-600',
      'Anxious': 'text-red-500',
      'Stressed': 'text-red-600',
      'Depressed': 'text-gray-700',
      'Lonely': 'text-indigo-600',
      'Frustrated': 'text-orange-600',
      'Overwhelmed': 'text-red-700',
      'Confused': 'text-purple-600'
    };
    return moodColors[mood] || 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {!userId ? 'Authenticating user...' : 'Loading your personalized resources...'}
          </p>
        </div>
      </div>
    );
  }

  // If no user is authenticated, show login message
  if (!user) {
    return (
      <div className="container mx-auto px-6 py-8 mt-16">
        <div className="text-center">
          <h2 className="text-2xl text-gray-800 font-bold mb-4">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to access your personalized mental health resources.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 mt-16">
      <h1 className="text-4xl text-gray-800 font-bold text-center mb-4">
        Explore Mental <em className="text-green-600 italic">Health</em> Resources
      </h1>

      {/* Display Current Mood */}
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600 inline">Your current mood today: </p>
        <span className={`text-3xl font-bold ${getMoodColor(currentMood)}`}>
          {currentMood}
        </span>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* First Row: YouTube & Journal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* YouTube Video Card */}
        <div className="card p-6 border rounded-lg shadow-lg hover:shadow-xl">
          <h3 className="text-3xl text-gray-600 font-semibold mb-4 text-center">YouTube Videos</h3>
          <div className="space-y-4">
            {resources.videos.length > 0 ? (
              resources.videos.map((video, index) => (
                <a 
                  key={index}
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-blue-500 hover:underline"
                >
                  {video.title}
                </a>
              ))
            ) : (
              <p className="text-gray-500">No videos available for your current mood.</p>
            )}
          </div>
        </div>

        {/* Guided Journals Card */}
        <div className="card p-6 border rounded-lg shadow-lg hover:shadow-xl">
          <h3 className="text-3xl text-gray-600 font-semibold mb-4 text-center">Guided Journals</h3>
          <div className="space-y-6">
            {resources.journal_prompts.length > 0 ? (
              resources.journal_prompts.map((prompt, index) => (
                <div key={index}>
                  <label className="block text-xl text-gray-700 mb-2">
                    Prompt {index + 1}: {prompt}
                  </label>
                  <textarea
                    value={responses[`prompt${index + 1}`] || ''}
                    onChange={(e) => handleInputChange(e, `prompt${index + 1}`)}
                    className="w-full text-xl text-gray-700 border-b-2 border-gray-400 focus:outline-none focus:border-green-500 pb-2"
                    rows="1"
                    placeholder="Write your thoughts here..."
                  ></textarea>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No journal prompts available for your current mood.</p>
            )}

            <button
              onClick={handleJournalSubmit}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-full hover:bg-yellow-600"
            >
              Submit Journal
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Apps, Quotes, Books Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Apps Card */}
        <div className="card p-6 border rounded-lg shadow-lg hover:shadow-xl">
          <h3 className="text-3xl text-gray-600 font-semibold mb-4 text-center">Mobile Apps</h3>
          <div className="space-y-4">
            {resources.apps.length > 0 ? (
              resources.apps.map((app, index) => (
                <a 
                  key={index}
                  href={app.url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-blue-500 hover:underline"
                >
                  {app}
                </a>
              ))
            ) : (
              <p className="text-gray-500">No apps available for your current mood.</p>
            )}
          </div>
        </div>

        {/* Motivational Quotes Card */}
        <div className="card p-6 border rounded-lg shadow-lg hover:shadow-xl">
          <h3 className="text-3xl text-gray-600 font-semibold mb-4 text-center">Quotes</h3>
          {resources.quotes.length > 0 ? (
            <div>
              <blockquote className="text-gray-800 italic text-5xl mb-4">
                "{resources.quotes[0]}"
              </blockquote>
              {resources.quotes.length > 1 && (
                <div className="mt-4 space-y-2">
                  {resources.quotes.slice(1).map((quote, index) => (
                    <p key={index} className="text-gray-700 text-lg italic">
                      "{quote}"
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No quotes available for your current mood.</p>
          )}
        </div>

        {/* Books Card */}
        <div className="card p-6 border rounded-lg shadow-lg hover:shadow-xl">
          <h3 className="text-3xl text-gray-600 font-semibold mb-4 text-center">Books</h3>
          <div className="space-y-4">
            {resources.books.length > 0 ? (
              resources.books.map((book, index) => (
                <p key={index} className="text-gray-700 font-semibold">
                  {book}
                </p>
              ))
            ) : (
              <p className="text-gray-500">No books available for your current mood.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthResources;