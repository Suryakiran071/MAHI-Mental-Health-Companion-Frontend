import React, { useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import login from "./assets/Login.png"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailPasswordLogin = async () => {
    setError(null);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Left side image with text overlay */}
      <div 
        className="flex-1 bg-cover bg-center relative hidden md:block"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${login})`,
        }}
      >
        {/* Text overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white px-5 max-w-4/5">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg leading-tight">
            Welcome Back
          </h1>
          <p className="text-xl font-normal mb-2 drop-shadow-md opacity-90">
            Track your mood, understand your patterns,
          </p>
          <p className="text-xl font-normal drop-shadow-md opacity-90">
            and improve your mental wellbeing
          </p>
        </div>
      </div>

      {/* Right side login box container */}
      <div className="flex-1 flex justify-center items-center bg-gray-50 p-5">
        {/* The login form card */}
        <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-xl">
          <h2 className="mb-6 font-semibold text-3xl text-center text-gray-800">
            {isRegistering ? "Register" : "Login"}
          </h2>

          {error && (
            <p className="text-red-600 mb-4 font-semibold text-center bg-red-50 p-3 rounded-md">
              {error}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleEmailPasswordLogin}
            className="w-full p-4 bg-blue-600 text-white border-none rounded-md font-semibold text-base cursor-pointer mb-6 hover:bg-blue-700 transition-colors duration-200"
          >
            {isRegistering ? "Register" : "Login"}
          </button>

          <div className="text-center mb-4 font-semibold text-gray-600">
            OR
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full p-4 border-2 border-blue-500 rounded-md bg-white text-blue-500 font-semibold text-base cursor-pointer flex items-center justify-center gap-3 hover:bg-blue-50 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 533.5 544.3"
              className="w-5 h-5"
            >
              <path
                fill="#4285f4"
                d="M533.5 278.4c0-17.7-1.6-34.8-4.6-51.3H272v97.2h146.9c-6.3 34-25.2 62.9-53.7 82v67h86.7c50.8-46.8 81.6-115.8 81.6-194.9z"
              />
              <path
                fill="#34a853"
                d="M272 544.3c72.8 0 133.9-24.2 178.5-65.6l-86.7-67c-24.1 16.1-55 25.5-91.8 25.5-70.6 0-130.6-47.7-152-111.8h-89.8v70.5c44.1 87.4 134.4 148.4 241.8 148.4z"
              />
              <path
                fill="#fbbc04"
                d="M120 324.9c-10.6-31.5-10.6-65.5 0-97h-89.9v-70.5h-0.2c-39.3 77.6-39.3 170.4 0 248l89.9-80.5z"
              />
              <path
                fill="#ea4335"
                d="M272 107.7c39.4-.6 77.4 13.9 106.1 39.7l79.6-79.6C404.9 24 344 0 272 0 164.6 0 74.3 61 30.2 148.4l89.8 70.5c21.4-64.1 81.4-111.2 152-111.2z"
              />
            </svg>
            Sign in with Google
          </button>

          <p className="mt-6 text-center font-semibold text-gray-700">
            {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
            >
              {isRegistering ? "Login here" : "Register here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;