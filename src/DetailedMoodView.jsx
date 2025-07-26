import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import very_happy from "./assets/Very_Happy.png";
import happy from "./assets/Happy.png";
import neutral from "./assets/Neutral.png";
import sad from "./assets/Sad.png";
import very_sad from "./assets/Very_Sad.png";
import Particles from './Components/Particles';

const DetailedMoodView = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Image mapping
  const moodImages = {
    "Very Happy": very_happy,
    Happy: happy,
    Neutral: neutral,
    Sad: sad,
    "Very Sad": very_sad,
  };

  // Fetch mood data for the selected date
  const fetchMoodByDate = async () => {
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }

    setLoading(true);
    setError("");
    setMoodData(null);

    try {
      const userId = auth.currentUser ? auth.currentUser.uid : "anonymous";
      const q = query(
        collection(db, 'mood_logs'),
        where("userId", "==", userId),
        where("date", "==", selectedDate)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError("No mood log found for this date");
      } else {
        // Get the first matching document (there should only be one per date per user)
        const doc = querySnapshot.docs[0];
        setMoodData(doc.data());
      }
    } catch (e) {
      console.error("Error fetching mood data: ", e);
      setError("Error fetching mood data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle going back to main mood tracker
  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="detailed-mood-view" style={{ position: 'relative', minHeight: '100vh' }}>
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

      <div className="container mx-auto py-8 px-10" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ marginTop: "80px" }}></div>

        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <button 
            className="bg-gray-600 text-white py-2 px-4 rounded-full hover:bg-gray-700 transition-colors"
            onClick={handleGoBack}
          >
            ← Back to Mood Tracker
          </button>
          <h1 className="text-4xl font-semibold text-center flex-1">
            Detailed <em className="text-green-600 italic">Mood</em> View
          </h1>
          <div className="w-48"></div> {/* Spacer for centering */}
        </div>

        {/* Main Content Area */}
        <div className={`flex gap-8 ${moodData ? 'justify-between' : 'justify-center'}`}>
          {/* Date Input Section */}
          <div className={`${moodData ? 'mt-20 w-1/2' : 'mt-20 w-1/2 mx-auto'} mb-8`}>
            <div className="card p-6 shadow-lg rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Enter Date to View <em className="text-green-600 italic">Mood</em>
              </h2>
              
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Select Date:</label>
                <input 
                  type="date" 
                  className="w-full text-xl text-gray-700 border-2 border-gray-400 focus:outline-none focus:border-green-500 p-3 rounded-lg"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <button 
                className="bg-green-600 text-white py-3 px-8 rounded-full text-lg w-full hover:bg-green-700 transition-colors disabled:bg-gray-400"
                onClick={fetchMoodByDate}
                disabled={loading}
              >
                {loading ? "Searching..." : "Get Mood Details"}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Mood Details Section */}
          {moodData && (
            <div className="w-1/2">
              <div className="card p-8 shadow-lg rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <h3 className="text-3xl font-semibold mb-6 text-center">
                  Mood Details for <em className="text-green-600 italic">{selectedDate}</em>
                </h3>

                {/* Mood Display with Image */}
                <div className="text-center mb-6">
                  <div className="flex justify-center items-center mb-4">
                    <img 
                      src={moodImages[moodData.mood]} 
                      alt={moodData.mood} 
                      className="w-24 h-24 mr-4"
                    />
                    <div>
                      <h4 className="text-2xl font-semibold">Mood:</h4>
                      <p className="text-3xl text-green-600 font-bold">{moodData.mood}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold mb-3">Additional Notes:</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-lg text-gray-700">
                      {moodData.note || "No additional notes for this day"}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold mb-3">Mood Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {moodData.tags && moodData.tags.length > 0 ? (
                      moodData.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-green-200 text-green-800 py-2 px-4 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No tags for this day</p>
                    )}
                  </div>
                </div>

                {/* Date confirmation */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    This mood was logged on <strong>{moodData.date}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedMoodView;