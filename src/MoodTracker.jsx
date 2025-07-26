import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import very_happy from "./assets/Very_Happy.png";
import happy from "./assets/Happy.png";
import neutral from "./assets/Neutral.png";
import sad from "./assets/Sad.png";
import very_sad from "./assets/Very_Sad.png";
import { db, auth } from './firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const MoodTracker = () => {
  const navigate = useNavigate();
  const [moodLogs, setMoodLogs] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [tagList, setTagList] = useState([]);
  const [logStatus, setLogStatus] = useState("");
  const [userMoodLogs, setUserMoodLogs] = useState([]);
  const [monthlyMoodData, setMonthlyMoodData] = useState({});
  const [moodAnalysis, setMoodAnalysis] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [hasAnalysisBeenLoaded, setHasAnalysisBeenLoaded] = useState(false);

  // Handle adding a mood log
  const addMoodLog = async () => {
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous";
    const newMoodLog = {
      date: new Date().toLocaleDateString('en-CA'),
      mood: selectedMood,
      comments: "",
      note: note,
      tags: tagList,
      userId: userId,
    };

    try {
      const docRef = await addDoc(collection(db, 'mood_logs'), newMoodLog);
      console.log("Mood log added with ID: ", docRef.id);

      setLogStatus("Mood log added successfully!");
      setSelectedMood("");
      setNote("");
      setTags("");
      setTagList([]);

      fetchUserMoodLogs();
      // Remove automatic analysis refresh after adding mood log

      setTimeout(() => {
        setLogStatus("");
      }, 3000);
    } catch (e) {
      console.error("Error adding mood log: ", e);
      setLogStatus("Error adding mood log!");
      setTimeout(() => {
        setLogStatus("");
      }, 3000);
    }
  };

  // Add tag to tag list
  const addTag = () => {
    if (tags && !tagList.includes(tags)) {
      setTagList([...tagList, tags]);
      setTags("");
    }
  };

  // Fetch all mood logs of the logged-in user
  const fetchUserMoodLogs = async () => {
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous";
    const q = query(
      collection(db, 'mood_logs'),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const logs = querySnapshot.docs.map(doc => doc.data());
    setUserMoodLogs(logs);
    setMoodLogs(logs);
    
    processMonthlyData(logs);
  };

  // Fetch mood analysis from backend
  const fetchMoodAnalysis = async () => {
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous";
    
    setAnalysisLoading(true);
    setAnalysisError("");
    
    try {
      const response = await fetch('http://localhost:8000/mood/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMoodAnalysis(data.mood_analysis);
      setHasAnalysisBeenLoaded(true);
    } catch (error) {
      console.error('Error fetching mood analysis:', error);
      setAnalysisError("Unable to fetch mood analysis. Please try again later.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Process mood logs by month
  const processMonthlyData = (logs) => {
    const monthlyData = {};
    
    logs.forEach(log => {
      const date = new Date(log.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthKey = `${year}-${month}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }
      
      const day = date.getDate();
      monthlyData[monthKey][day] = log.mood;
    });
    
    setMonthlyMoodData(monthlyData);
  };

  // Navigate to detailed mood view
  const handleViewDetailedMood = () => {
    navigate('/detailed-mood');
  };

  // Navigate to resources page
  const handleNavigateToResources = () => {
    navigate('/resource');
  };

  // Fetch mood logs when the component mounts (but not analysis)
  useEffect(() => {
    fetchUserMoodLogs();
    // Remove automatic analysis fetch
  }, []);

  // Aggregate mood counts for the pie chart
  const aggregateMoodData = () => {
    const moodCount = moodLogs.reduce(
      (count, log) => {
        count[log.mood] = (count[log.mood] || 0) + 1;
        return count;
      },
      { "Very Happy": 0, Happy: 0, Neutral: 0, Sad: 0, "Very Sad": 0 }
    );

    return moodCount;
  };

  // Prepare data for the doughnut chart (mood overview)
  const moodCount = aggregateMoodData();

  const moodData = {
    labels: ["Very Happy", "Happy", "Neutral", "Sad", "Very Sad"],
    datasets: [
      {
        data: [moodCount["Very Happy"], moodCount.Happy, moodCount.Neutral, moodCount.Sad, moodCount["Very Sad"]],
        backgroundColor: [
          "#45AC48",
          "#83D486",
          "#FFD43F",
          "#FFADA7",
          "#EE4B4B"
        ],
        borderColor: [
          "#45AC48", "#83D486", "#FFD43F", "#FFADA7", "#EE4B4B"
        ],
        borderWidth: 1,
        cutout: "80%",
      },
    ],
  };

  // Find the mood with the highest count
  const mostFrequentMood = Object.keys(moodCount).reduce((a, b) => moodCount[a] > moodCount[b] ? a : b);

  // Image mapping
  const moodImages = {
    "Very Happy": very_happy,
    Happy: happy,
    Neutral: neutral,
    Sad: sad,
    "Very Sad": very_sad,
  };

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Generate days for a specific month
  const generateMonthDays = (year, month) => {
    const days = [];
    const daysInMonth = getDaysInMonth(year, month);
    const monthKey = `${year}-${month}`;
    const monthData = monthlyMoodData[monthKey] || {};

    for (let i = 1; i <= daysInMonth; i++) {
      const mood = monthData[i] || "No Mood";
      days.push(mood);
    }

    return days;
  };

  // Define the months to display
  const currentYear = 2025;
  const monthsToDisplay = [
    { name: "May", year: currentYear, month: 4 },
    { name: "June", year: currentYear, month: 5 },
    { name: "July", year: currentYear, month: 6 }
  ];

  // Format analysis text for better display
  const formatAnalysisText = (text) => {
    if (!text) return "";
    
    // Split by common patterns and format
    const sections = text.split(/(?=- Overall Mood Summary:|Overall Mood Summary:|Mood Fluctuations:|Suggestions:)/);
    
    return sections.map((section, index) => {
      if (section.trim()) {
        return (
          <div key={index} className="mb-4">
            <p className="text-gray-700 leading-relaxed">{section.trim()}</p>
          </div>
        );
      }
      return null;
    });
  };

  // Get button text based on current state
  const getAnalysisButtonText = () => {
    if (analysisLoading) return "Loading...";
    if (hasAnalysisBeenLoaded) return "Refresh Analysis";
    return "View Analysis";
  };

  return (
    <div className="mood-tracker">
      <div className="container mx-auto py-8 px-10">
        <div style={{ marginTop: "80px" }}></div>

        {/* Updated Header with Resources Button */}
        <div className="relative mb-8">
          <h1 className="text-4xl font-semibold text-center">Mood <em className="text-green-600 italic">Tracker</em></h1>
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-600 text-white py-2 px-4 rounded-full text-sm hover:bg-green-700 transition-colors shadow-md"
            onClick={handleNavigateToResources}
          >
            Personalized Resources for You
          </button>
        </div>

        {logStatus && (
          <div className="alert" style={{ padding: '10px', backgroundColor: '#f4e1d2', color: '#d9534f', borderRadius: '5px', textAlign: 'center' }}>
            <p>{logStatus}</p>
          </div>
        )}

        <div className="flex space-x-8">
          {/* Left Card - Mood Input */}
          <div className="card w-2/3 p-3 shadow-lg rounded-lg ml-8" style={{ height: "525px", padding: "20px" }}>
            <h1 className="jua-regular text-3xl text-gray-600 font-semibold mb-6">How are you <em className="text-green-600 italic">feeling</em> today?</h1>

            <div className="mood-icons flex justify-between mb-4">
              {["Very Happy", "Happy", "Neutral", "Sad", "Very Sad"].map((mood) => (
                <span
                  key={mood}
                  className={`cursor-pointer ${selectedMood === mood ? "border-2 border-black p-2 rounded-full" : "hover:bg-green-200 hover:transition-all hover:duration-200 hover:ease-in p-2 rounded-full"}`}
                  onClick={() => setSelectedMood(mood)}
                >
                  <img src={moodImages[mood]} alt={mood} className="w-16 h-16 mx-1" />
                </span>
              ))}
            </div>

            {/* Additional Notes and Description */}
            <div className="mb-4">
              <label className="jua-regular text-3xl text-gray-600 block text-lg"><b>Additional Notes</b></label>
              <textarea className="w-full text-xl text-gray-700 border-b-2 border-gray-400 focus:outline-none focus:border-green-500 pb-2 p-3 rounded-lg mt-2" rows="2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Enter Your Mood Description"></textarea>
            </div>

            {/* Mood Tags */}
            <div className="mb-4">
              <label className="jua-regular text-3xl text-gray-600 block text-lg"><b>Mood Tags</b></label>
              <div className="flex items-center">
                <input type="text" className="w-full text-xl text-gray-700 border-b-2 border-gray-400 focus:outline-none focus:border-green-500 pb-2 p-3 rounded-lg mt-2" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. family, excited" />
                <button className="bg-white text-black border-2 border-black py-2 px-4 rounded-full ml-2 hover:bg-black hover:text-white transition-colors" onClick={addTag}>
                  Add Tag
                </button>
              </div>
            </div>

            <div className="mb-4">
              {tagList.map((tag, index) => (
                <button key={index} className="bg-gray-300 py-1 px-3 rounded-full text-sm mr-2 mb-2">
                  {tag}
                </button>
              ))}
            </div>

            <button className="bg-white text-black border-2 border-black py-3 px-8 rounded-full text-lg w-full hover:bg-black hover:text-white transition-colors" onClick={addMoodLog}>
              Add Mood Log
            </button>
          </div>

          {/* Right Card - Mood Overview */}
          <div className="card w-1/3 p-6 shadow-lg rounded-lg mr-10" style={{ height: "525px", padding: "20px" }}>
            <Doughnut data={moodData} options={{ responsive: true, width: 200, height: 200 }} />
            <div className="text-center mt-4">
              <h3 className="text-xl font-semibold">Most <em className="text-green-600 italic">Frequent</em> Mood: {mostFrequentMood}</h3>
            </div>
          </div>
        </div>

        {/* Mood Over Time */}
        <div className="mt-12">
          <div className="flex justify-center items-center mb-4 space-x-4">
            <h2 className="text-2xl font-semibold">Your <em className="text-green-600 italic">Mood</em> Over Time</h2>
            <button 
              className="bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition-colors"
              onClick={handleViewDetailedMood}
            >
              View Detailed Mood
            </button>
          </div>

          {/* Month View: Display May, June, and July in a row */}
          <div className="container mx-auto py-8 px-40">
            <div className="grid grid-cols-3 gap-6 text-center px-8">
              {monthsToDisplay.map((monthInfo, idx) => {
                const monthDays = generateMonthDays(monthInfo.year, monthInfo.month);
                return (
                  <div key={idx} className="month-card p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold">{monthInfo.name} {monthInfo.year}</h3>
                    <div className="grid grid-cols-7 gap-2 text-center mt-4">
                      {monthDays.map((mood, index) => (
                        <div key={index} className="day-dot p-1 rounded-full bg-gray-200">
                          {mood !== "No Mood" && <img src={moodImages[mood]} alt={mood} className="w-6 h-6" />}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Your Analysis Section */}
        <div className="mt-12">
          <div className="flex justify-center items-center mb-6 space-x-4">
            <h2 className="text-2xl font-semibold">Your <em className="text-green-600 italic">Analysis</em></h2>
            <button 
              className="bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={fetchMoodAnalysis}
              disabled={analysisLoading}
            >
              {getAnalysisButtonText()}
            </button>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="card p-6 shadow-lg rounded-lg bg-white">
              {analysisLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <span className="ml-4 text-gray-600">Analyzing your mood patterns...</span>
                </div>
              ) : analysisError ? (
                <div className="text-center py-8">
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {analysisError}
                  </div>
                </div>
              ) : moodAnalysis ? (
                <div className="prose max-w-none">
                  <div className="text-gray-800">
                    {formatAnalysisText(moodAnalysis)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Click "View Analysis" to see your personalized mood analysis.</p>
                  <p className="text-sm mt-2">Make sure you have logged some moods first!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;