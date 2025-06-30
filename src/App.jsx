import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import MoodTracker from "./MoodTracker";
import ContactPage from "./ContactPage";
import LoginPage from "./LoginPage";
import ChatbotPage from "./Chatbot";

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tracker" element={<MoodTracker />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} /> 
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
