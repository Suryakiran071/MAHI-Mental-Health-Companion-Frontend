import React, { useState, useRef, useEffect } from "react";
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
// Import Firebase functions
import { db } from "./firebase"; // Adjust path as needed
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

const FloatingChatButton = () => {
  return (
    <Link to="/chatbot">
      <button className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg z-10">
        <span className="text-1xl">Chat Now💬</span> {/* Chat Icon */}
      </button>
    </Link>
  );
};

const StarRating = ({ rating, onRatingChange, interactive = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={index}
            type={interactive ? "button" : undefined}
            className={`text-xl transition-colors duration-200 ${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            } ${
              ratingValue <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={interactive ? () => onRatingChange(ratingValue) : undefined}
            onMouseEnter={interactive ? () => setHover(ratingValue) : undefined}
            onMouseLeave={interactive ? () => setHover(0) : undefined}
            disabled={!interactive}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

const FeedbackCard = ({ feedback }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
          {feedback.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{feedback.name}</h3>
          <StarRating rating={feedback.rating} />
        </div>
      </div>
      <p className="text-gray-600 italic leading-relaxed">"{feedback.feedback}"</p>
      <div className="mt-4 text-sm text-gray-400">
        {feedback.createdAt && new Date(feedback.createdAt.toDate()).toLocaleDateString()}
      </div>
    </div>
  );
};



const FeedbackSection = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    feedback: ""
  });
  const [submitMessage, setSubmitMessage] = useState("");

  // Fetch feedbacks from Firestore
  const fetchFeedbacks = async () => {
    try {
      const feedbackRef = collection(db, "feedbacks");
      const q = query(feedbackRef, orderBy("createdAt", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      
      const feedbackData = [];
      querySnapshot.forEach((doc) => {
        feedbackData.push({ id: doc.id, ...doc.data() });
      });
      
      // Shuffle and get random 3 feedbacks
      const shuffled = feedbackData.sort(() => 0.5 - Math.random());
      setFeedbacks(shuffled.slice(0, 3));
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rating || !formData.feedback) {
      setSubmitMessage("Please fill in all fields");
      return;
    }

    setSubmitLoading(true);
    try {
      await addDoc(collection(db, "feedbacks"), {
        name: formData.name,
        rating: formData.rating,
        feedback: formData.feedback,
        createdAt: new Date()
      });
      
      setSubmitMessage("Thank you for your feedback! It has been submitted successfully.");
      setFormData({ name: "", rating: 0, feedback: "" });
      
      // Refresh feedbacks to potentially show the new one
      setTimeout(() => {
        fetchFeedbacks();
      }, 1000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitMessage("Error submitting feedback. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating: rating
    });
  };

  return (
    <div className="bg-gray-50 py-12">
      {/* User Feedbacks Display Section */}
      <section className="container mx-auto px-4 md:px-16 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
            What Our <em className="text-green-600 italic">Users</em> Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real experiences from people who have found support and healing through MAHI
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 text-lg">No feedbacks available yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Submit Feedback Section with Reduced Height */}
      <section className="w-full">
        <div className="flex flex-col lg:flex-row min-h-[400px]">
          {/* Left Half - Green Background with Title */}
          <div className="lg:w-1/2 bg-green-600 flex items-center justify-center p-6 lg:p-12">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-4 text-white">
                Share Your <em className="italic">Experience</em>
              </h2>
              <p className="text-green-100 text-base md:text-lg max-w-md">
                Help others discover the benefits of MAHI by sharing your feedback and joining our community of wellness
              </p>
            </div>
          </div>

          {/* Right Half - White Background with Compact Form */}
          <div className="lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name and Rating in same row */}
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Rating
                    </label>
                    <div className="flex items-center space-x-2">
                      <StarRating 
                        rating={formData.rating} 
                        onRatingChange={handleRatingChange} 
                        interactive={true}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Share your experience with MAHI..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>

                {submitMessage && (
                  <div className={`p-3 rounded-lg text-center text-sm ${
                    submitMessage.includes("Error") 
                      ? "bg-red-100 text-red-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
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
              <Link to="/resource">
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
      
      {/* User Feedback Section */}
      <FeedbackSection />
      
      {/* Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
};

export default HeroSection;