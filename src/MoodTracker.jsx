import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2"; // Use Doughnut chart for mood progress
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import very_happy from "./assets/very_happy.png";
import happy from "./assets/Happy.png";
import neutral from "./assets/Neutral.png";
import sad from "./assets/Sad.png";
import very_sad from "./assets/very_sad.png";
import { db, auth } from './firebase';  // import db and auth from firebase.js
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';  // Firestore methods

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const MoodTracker = () => {
  const [moodLogs, setMoodLogs] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState(""); // For adding a note
  const [tags, setTags] = useState(""); // For mood tags
  const [tagList, setTagList] = useState([]); // To store the added tags
  const [logStatus, setLogStatus] = useState(""); // For showing success/failure status
  const [userMoodLogs, setUserMoodLogs] = useState([]); // For displaying logged user's mood logs
  const [monthlyMoodData, setMonthlyMoodData] = useState({}); // Store mood data by month

  // Handle adding a mood log
  const addMoodLog = async () => {
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous"; // Get user ID from Firebase Authentication
    const newMoodLog = {
      date: new Date().toLocaleDateString('en-CA'),  // Current date in YYYY-MM-DD format
      mood: selectedMood,
      comments: "",  // You can include additional comments if needed
      note: note,
      tags: tagList,
      userId: userId,  // Include the user ID
    };

    try {
      // Add the new mood log to the "mood_logs" collection in Firestore
      const docRef = await addDoc(collection(db, 'mood_logs'), newMoodLog);
      console.log("Mood log added with ID: ", docRef.id);

      // Show success message
      setLogStatus("Mood log added successfully!");

      // Reset input fields
      setSelectedMood("");
      setNote("");
      setTags("");
      setTagList([]);

      // Refetch the mood logs after successful submission
      fetchUserMoodLogs();

      // Hide message after 3 seconds
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
      setTags(""); // Clear the tag input
    }
  };

  // Fetch all mood logs of the logged-in user
  const fetchUserMoodLogs = async () => {
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous"; // Get the logged-in user's ID
    const q = query(
      collection(db, 'mood_logs'),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const logs = querySnapshot.docs.map(doc => doc.data());
    setUserMoodLogs(logs); // Set the mood logs of the user to state
    setMoodLogs(logs); // Also set moodLogs to the fetched data for aggregation
    
    // Process monthly data
    processMonthlyData(logs);
  };

  // Process mood logs by month
  const processMonthlyData = (logs) => {
    const monthlyData = {};
    
    logs.forEach(log => {
      const date = new Date(log.date);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-based month (0 = January, 4 = May, 5 = June, 6 = July)
      const monthKey = `${year}-${month}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }
      
      const day = date.getDate();
      monthlyData[monthKey][day] = log.mood;
    });
    
    setMonthlyMoodData(monthlyData);
  };

  // Fetch mood logs when the component mounts
  useEffect(() => {
    // Fetch mood logs for the logged-in user as soon as the component mounts
    fetchUserMoodLogs();  // Fetch all mood logs of the logged-in user
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
          "#45AC48", // Yellow for Very Happy
          "#83D486", // Light Green for Happy
          "#FFD43F", // Orange for Neutral
          "#FFADA7", // Red for Sad
          "#EE4B4B"  // Grey for Very Sad
        ],
        borderColor: [
          "#45AC48", "#83D486", "#FFD43F", "#FFADA7", "#EE4B4B"
        ],
        borderWidth: 1,
        cutout: "80%", // Reduce thickness by increasing the cutout percentage
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
    { name: "May", year: currentYear, month: 4 }, // May = month 4 (0-based)
    { name: "June", year: currentYear, month: 5 }, // June = month 5
    { name: "July", year: currentYear, month: 6 }  // July = month 6
  ];

  return (
    <div className="mood-tracker">
      <div className="container mx-auto py-8 px-10">
        <div style={{ marginTop: "80px" }}></div>

        <h1 className="text-4xl font-semibold mb-8 text-center">Mood <em className="text-green-600 italic">Tracker</em></h1>

        {logStatus && (
          <div className="alert" style={{ padding: '10px', backgroundColor: '#f4e1d2', color: '#d9534f', borderRadius: '5px', textAlign: 'center' }}>
            <p>{logStatus}</p>
          </div>
        )}

        <div className="flex space-x-8">
          {/* Left Card - Mood Input */}
          <div className="card w-2/3 p-3 shadow-lg rounded-lg ml-8" style={{ height: "525px", padding: "20px" }}>
            <h1 className="text-2xl font-semibold mb-6">How are you <em className="text-green-600 italic">feeling</em> today?</h1>

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
              <label className="block text-lg"><b>Additional Notes</b></label>
              <textarea className="p-3 border rounded-lg w-full mt-2" rows="3" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
            </div>

            {/* Mood Tags */}
            <div className="mb-4">
              <label className="block text-lg"><b>Mood Tags</b></label>
              <div className="flex items-center">
                <input type="text" className="p-3 border rounded-lg w-full mt-2" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. family, excited" />
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
          <h2 className="text-2xl font-semibold mb-4 text-center">Your <em className="text-green-600 italic">Mood</em> Over Time</h2>

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
                        <div key={index} className="day-dot p-1 rounded-full bg-gray-300">
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

        {/* Display User's Mood Logs as Cards */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">Your Mood Logs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userMoodLogs.map((log, idx) => (
              <div key={idx} className="card p-4 shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold">Date: {log.date}</h3>
                <p><strong>Mood:</strong> {log.mood}</p>
                <p><strong>Note:</strong> {log.note}</p>
                <p><strong>Tags:</strong> {log.tags.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;