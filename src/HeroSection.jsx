import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import mental from "./assets/background.jpg";
import girl from "./assets/Girl.jpg";
import tracking from "./assets/Mood-Tracking.png";
// Add placeholders for new images - replace with actual image imports
import mindfulness from "./assets/MeditationGirl.jpg";
import community from "./assets/CBT.jpg";
import insights from "./assets/Resources.jpg";
import FAQSection from "./FAQSection"; // or define in same file above HeroSection
import Magnet from './Components/Magnet'
import BlurText from "./Components/BlurText";

const FloatingChatButton = () => {
  return (
    <Link to="/chatbot">
      <button className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg z-10">
        <span className="text-1xl">Chat Now💬</span> {/* Chat Icon */}
      </button>
    </Link>
  );
};

const HeroSection = ({ isLoggedIn }) => {
  // Create a ref for the target section
  const sectionRef = useRef(null);

  // Mood state
  const [mood, setMood] = useState("");

  // Function to scroll to the target section when "Explore Now" is clicked
  const handleScrollToSection = () => {
    sectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

  // Handle mood selection
  const handleMoodChange = (selectedMood) => {
    setMood(selectedMood);
    // You can save this mood to state or a database here if needed
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative w-full h-screen bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${mental})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Content container with padding-top to clear the navbar height */}
        <div className="relative z-10 max-w-3xl px-8 md:px-16 text-left pt-16">

          <BlurText
  text="Your Personal AI-Powered Mental Health Companion"
  delay={150}
  animateBy="words"
  direction="top"
  onAnimationComplete={handleAnimationComplete}
  className="text-white text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg"
/>
          <p className="text-gray-200 text-lg md:text-xl mb-8 drop-shadow-md max-w-xl">
            Support your mental well-being with personalized, empathetic assistance.
            Track your mood, practice mindfulness, and get tailored advice anytime.
          </p>
          

          {/* Conditionally Render Explore Now or Mood Input */}
          {isLoggedIn ? (
            <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 mx-auto">
              <h2 className="text-2xl mb-4 font-semibold">How are you feeling today?</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleMoodChange("Happy")}
                  className="bg-green-500 text-white p-3 rounded-full"
                >
                  Happy
                </button>
                <button
                  onClick={() => handleMoodChange("Sad")}
                  className="bg-blue-500 text-white p-3 rounded-full"
                >
                  Sad
                </button>
                <button
                  onClick={() => handleMoodChange("Anxious")}
                  className="bg-yellow-500 text-white p-3 rounded-full"
                >
                  Anxious
                </button>
                <button
                  onClick={() => handleMoodChange("Neutral")}
                  className="bg-gray-500 text-white p-3 rounded-full"
                >
                  Neutral
                </button>
              </div>

              {/* Show selected mood */}
              {mood && <p className="mt-4 text-lg">You are feeling: {mood}</p>}
            </div>
          ) : (
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-full text-lg transition duration-300 drop-shadow-md"
              onClick={handleScrollToSection} // OnClick to scroll
            >
              Explore Now
            </button>
          )}
        </div>
      </section>

      {/* Section with Text on Left and Image on Right */}
      <section className="bg-white py-24 min-h-screen flex items-center justify-center px-4 md:px-16">
        <div className="container mx-auto flex flex-col md:flex-row items-center md:space-x-20">
          {/* Left Text */}
          <div className="md:w-1/2 ml-10 text-left">
            
            <Magnet padding={500} disabled={false} magnetStrength={10}>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
              Always <em className="text-green-600 italic">Available</em>
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-md mb-8">
              Whether you're dealing with late-night worries or early morning doubts, Mahi is here for you 24/7.
            </p>
            <Link to="/chatbot">
              <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg">
                Start Chat Now
              </button>
            </Link>
            </Magnet>
          </div>

          {/* Right Image with left-to-right white gradient */}
          <div className="md:w-3/4 mt-12 pr-10 md:mt-0 relative">
            <img
              src={girl}
              alt="Person video calling with phone"
              className="rounded-xl shadow-lg max-w-full h-auto relative z-10"
            />
            {/* Gradient overlay */}
            <div
              className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none"
              style={{
                background: "linear-gradient(to right, white 5%, transparent 35%)",
                zIndex: 20,
              }}
            />
          </div>
        </div>
      </section>

      {/* Mood Tracking Section: Image Left and Text Right */}
      <section className="bg-white py-24 min-h-screen flex items-center justify-center px-4 md:px-16">
        <div className="container mx-auto flex flex-col md:flex-row items-center md:space-x-20">
          {/* Left Image */}
          <div className="md:w-3/4 mt-12 md:mt-0 relative">
            <img
              src={tracking}
              alt="Mood tracking illustration"
              className="rounded-xl shadow-lg max-w-full h-auto relative z-10"
            />
            <div
              className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none"
              style={{
                background: "linear-gradient(to left, white 15%, transparent 50%)",
                zIndex: 20,
              }}
            />
          </div>

          {/* Right Text */}
          <div className="md:w-1/2 ml-10 text-left">
          <Magnet padding={500} disabled={false} magnetStrength={10}>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
              Mood Tracking and <em className="text-green-600 italic">Analysis</em>
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-md mb-8">
              MAHI can track users' moods and emotions daily, offering insights into their emotional patterns.
            </p>
            <Link to="/tracker">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg">
                Track My Mood
              </button>
            </Link>
            </Magnet>
          </div>
        </div>
      </section>

      {/* Mindfulness Section: Text Left and Image Right */}
      <section className="bg-white py-24 min-h-screen flex items-center justify-center px-4 md:px-16">
        <div className="container mx-auto flex flex-col md:flex-row items-center md:space-x-20">
          {/* Left Text */}
          <div className="md:w-1/2 ml-10 text-left">
            <Magnet padding={500} disabled={false} magnetStrength={10}>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
                Guided Meditation and <em className="text-green-600 italic">Mindfulness</em>
              </h2>
              <p className="text-gray-700 text-lg md:text-xl max-w-md mb-8">
                Practice mindfulness with personalized meditation sessions, breathing exercises, and relaxation techniques tailored to your needs.
              </p>
              <Link to="/meditation">
                <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg">
                  Start Meditation
                </button>
              </Link>
            </Magnet>
          </div>

          {/* Right Image with left-to-right white gradient */}
          <div className="md:w-3/4 mt-12 pr-10 md:mt-0 relative">
            <img
              src={mindfulness}
              alt="Mindfulness and meditation illustration"
              className="rounded-xl shadow-lg max-w-full h-auto relative z-10"
            />
            {/* Gradient overlay */}
            <div
              className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none"
              style={{
                background: "linear-gradient(to right, white 5%, transparent 35%)",
                zIndex: 20,
              }}
            />
          </div>
        </div>
      </section>

      {/* Community Support Section: Image Left and Text Right */}
      <section className="bg-white py-24 min-h-screen flex items-center justify-center px-4 md:px-16">
        <div className="container mx-auto flex flex-col md:flex-row items-center md:space-x-20">
          {/* Left Image */}
          <div className="md:w-3/4 mt-12 md:mt-0 relative">
            <img
              src={community}
              alt="Community support illustration"
              className="rounded-xl shadow-lg max-w-full h-auto relative z-10"
            />
            <div
              className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none"
              style={{
                background: "linear-gradient(to left, white 15%, transparent 50%)",
                zIndex: 20,
              }}
            />
          </div>

          {/* Right Text */}
          <div className="md:w-1/2 ml-10 text-left">
            <Magnet padding={500} disabled={false} magnetStrength={10}>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
                Cognitive <em className="text-green-600 italic">Behavioural</em> Therapy 
              </h2>
              <p className="text-gray-700 text-lg md:text-xl max-w-md mb-8">
                MAHI provides interactive CBT-based exercises to help users recognize negative thought patterns and develop healthier coping strategies, promoting long-term emotional well-being.
              </p>
              <Link to="/cbt">
                <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg">
                  Try CBT Exercises
                </button>
              </Link>
            </Magnet>
          </div>
        </div>
      </section>

      {/* Personalized Insights Section: Text Left and Image Right */}
      <section className="bg-white py-24 min-h-screen flex items-center justify-center px-4 md:px-16">
        <div className="container mx-auto flex flex-col md:flex-row items-center md:space-x-20">
          {/* Left Text */}
          <div className="md:w-1/2 ml-10 text-left">
            <Magnet padding={500} disabled={false} magnetStrength={10}>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
                 <em className="text-green-600 italic">Personalized</em> Resource Recommendations
              </h2>
              <p className="text-gray-700 text-lg md:text-xl max-w-md mb-8">
                MAHI curates articles, videos, and exercises tailored to the user's mood history and emotional needs, ensuring timely and relevant mental health support.
              </p>
              <Link to="/resources">
                <button className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg">
                  Explore Resources
                </button>
              </Link>
            </Magnet>
          </div>

          {/* Right Image with left-to-right white gradient */}
          <div className="md:w-3/4 mt-12 pr-10 md:mt-0 relative">
            <img
              src={insights}
              alt="Personalized insights illustration"
              className="rounded-xl shadow-lg max-w-full h-auto relative z-10"
            />
            {/* Gradient overlay */}
            <div
              className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none"
              style={{
                background: "linear-gradient(to right, white 5%, transparent 35%)",
                zIndex: 20,
              }}
            />
          </div>
        </div>
      </section>

      <FAQSection />
      
      {/* Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
};

export default HeroSection;