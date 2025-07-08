import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import MoodTracker from "./MoodTracker";
import ContactPage from "./ContactPage";
import LoginPage from "./LoginPage";
import ChatbotPage from "./ChatBot";
import MentalHealthResources from "./MentalHealthResources";
import DetailedMoodView from "./DetailedMoodView";
import Ballpit from "./Components/Ballpit";
import Meditation from "./Meditation";
import CBTChatbot from "./CBTChatbot";

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ball" element={<Ballpit />} />
          <Route path="/tracker" element={<MoodTracker />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/resource" element={<MentalHealthResources />} />
          <Route path="/detailed-mood" element={<DetailedMoodView />} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/cbt" element={<CBTChatbot />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
