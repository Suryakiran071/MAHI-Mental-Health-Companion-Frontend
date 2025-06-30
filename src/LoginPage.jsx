import React, { useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import login from "./assets/Login.png"

const placeholderImage =
  "https://via.placeholder.com/600x800?text=Your+Image+Here";

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
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Left side image */}
      <div
        style={{
          flex: 1,
          backgroundImage: `url(${login})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "none",
        }}
        className="left-side-image"
      />

      {/* Right side login box container - center content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9fafb",
          padding: 20,
        }}
      >
        {/* The login form card */}
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: "white",
            padding: 40,
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          <h2
            style={{
              marginBottom: 24,
              fontWeight: "600",
              fontSize: "1.8rem",
              textAlign: "center",
            }}
          >
            {isRegistering ? "Register" : "Login"}
          </h2>

          {error && (
            <p
              style={{
                color: "red",
                marginBottom: 16,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 16,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 24,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />
          <button
            onClick={handleEmailPasswordLogin}
            style={{
              width: "100%",
              padding: 14,
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontWeight: "600",
              fontSize: 16,
              cursor: "pointer",
              marginBottom: 24,
            }}
          >
            {isRegistering ? "Register" : "Login"}
          </button>

          <div
            style={{
              textAlign: "center",
              marginBottom: 16,
              fontWeight: "600",
              color: "#666",
            }}
          >
            OR
          </div>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: 14,
              border: "1.5px solid #4285F4",
              borderRadius: 6,
              backgroundColor: "white",
              color: "#4285F4",
              fontWeight: "600",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 533.5 544.3"
              width="20"
              height="20"
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

          <p
            style={{
              marginTop: 24,
              textAlign: "center",
              fontWeight: "600",
              color: "#555",
            }}
          >
            {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => setIsRegistering(!isRegistering)}
              style={{ color: "#2563eb", cursor: "pointer" }}
            >
              {isRegistering ? "Login here" : "Register here"}
            </span>
          </p>
        </div>
      </div>

      {/* Responsive: Show image only on larger screens */}
      <style>{`
        @media (min-width: 768px) {
          .left-side-image {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
