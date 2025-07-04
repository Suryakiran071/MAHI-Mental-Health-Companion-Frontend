import React, { useState } from 'react';

const MentalHealthResources = () => {
  // State to handle journal responses
  const [responses, setResponses] = useState({
    prompt1: "",
    prompt2: "",
  });

  // Handle input changes for journal responses
  const handleInputChange = (e, prompt) => {
    setResponses({
      ...responses,
      [prompt]: e.target.value,
    });
  };

  // Handle journal submission (e.g., store or process the answers)
  const handleJournalSubmit = () => {
    console.log("User's journal responses:", responses);
    // You can later process or store these responses (e.g., save to Firestore or display feedback)
  };

  return (
    <div className="container mx-auto px-6 py-8 mt-16"> {/* Added margin-top to avoid navbar overlap */}
      <h1 className="fredericka-the-great-regular text-4xl text-gray-800 font-bold text-center mb-8">
        Explore Mental <em className="text-green-600 italic">Health</em> Resources
      </h1>

      {/* First Row: YouTube & Journal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* YouTube Video Card */}
        <div className="card p-6 border rounded-lg shadow-lg hover:shadow-xl">
          <h3 className="jua-regular text-3xl text-gray-600 font-semibold mb-4 text-center">YouTube Videos</h3>
          <div className="space-y-4">
            <a href="https://www.youtube.com/watch?v=video1" target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline">
              Motivational Video 1
            </a>
            <a href="https://www.youtube.com/watch?v=video2" target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline">
              Motivational Video 2
            </a>
            <a href="https://www.youtube.com/watch?v=video3" target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline">
              Motivational Video 3
            </a>
          </div>
        </div>

        {/* Guided Journals Card */}
        <div className="card p-6 border rounded-lg shadow-lg hover:shadow-xl">
          <h3 className="jua-regular text-3xl text-gray-600 font-semibold mb-4 text-center">Guided Journals</h3>
          {/* Journal Prompts */}
          <div className="space-y-6">
            <div>
              <label className="block text-xl text-gray-700 mb-2">Prompt 1: How are you feeling today?</label>
              <textarea
                value={responses.prompt1}
                onChange={(e) => handleInputChange(e, 'prompt1')}
                className="w-full text-xl text-gray-700 border-b-2 border-gray-400 focus:outline-none focus:border-green-500 pb-2"
                rows="1" // Shorter height
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>

            <div>
              <label className="block text-xl text-gray-700 mb-2">Prompt 2: What is one thing you're grateful for today?</label>
              <textarea
                value={responses.prompt2}
                onChange={(e) => handleInputChange(e, 'prompt2')}
                className="w-full text-xl text-gray-700 border-b-2 border-gray-400 focus:outline-none focus:border-green-500 pb-2"
                rows="1" // Shorter height
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>

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
          <h3 className="jua-regular text-3xl text-gray-600 font-semibold mb-4 text-center">Mobile Apps</h3>
          <div className="space-y-4">
            <a href="https://www.appstore.com/app1" target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline">App 1</a>
            <a href="https://www.appstore.com/app2" target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline">App 2</a>
            <a href="https://www.appstore.com/app3" target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline">App 3</a>
          </div>
        </div>

        {/* Motivational Quotes Card */}
        <div className="card p-6 border rounded-lg shadow-lg hover:shadow-xl">
          <h3 className="jua-regular text-3xl text-gray-600 font-semibold mb-4 text-center">Quotes</h3>
          <blockquote className="rochester-regular text-gray-800 italic text-5xl mb-4">
            "The only way to do great work is to love what you do."
          </blockquote>
          <p className="text-gray-700 text-xl font-normal text-right">- Steve Jobs</p>
        </div>

        {/* Books Card */}
        <div className="card p-6 border rounded-lg shadow-lg hover:shadow-xl">
          <h3 className="jua-regular text-3xl text-gray-600 font-semibold mb-4 text-center">Books</h3>
          <p className="text-gray-700 font-semibold">Title: *The Power of Now* <br /> Author: Eckhart Tolle</p>
          <p className="text-gray-700 font-semibold">Title: *Atomic Habits* <br /> Author: James Clear</p>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthResources;
