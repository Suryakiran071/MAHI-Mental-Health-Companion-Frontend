import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "./assets/Mahi-Logo.png";        // Original Logo
import whitelogo from "./assets/Logo-White.png";  // White Logo
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const lastScrollY = useRef(window.scrollY);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollPosition(currentScrollY);
      lastScrollY.current = currentScrollY;
    };

    // Only add scroll listener on home page
    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [location.pathname]); // Add location.pathname as dependency

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setDropdownOpen(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setDropdownOpen(false);
  };

  const isHomePage = location.pathname === "/";

  // Only apply scroll-based styling on home page
  const getLinkColorClass = () => {
    if (!isHomePage) return "rgb(0, 0, 0)"; // Always black on non-home pages
    
    const scrollPercent = Math.min(1, Math.max(0, scrollPosition / 300));
    const colorValue = Math.floor((1 - scrollPercent) * 255);
    return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
  };

  const getLogoOpacity = () => {
    if (!isHomePage) return 0; // Hide white logo on non-home pages
    
    const scrollPercent = Math.min(1, Math.max(0, scrollPosition / 800));
    return scrollPercent;
  };

  const linkStyle = {
    transition: "color 0.3s ease",
    color: getLinkColorClass(),
  };

  const logoStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    transition: "opacity 0.3s ease",
    opacity: isHomePage ? 1 - getLogoOpacity() : 0, // Hide white logo on non-home pages
  };

  const blackLogoStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    transition: "opacity 0.3s ease",
    opacity: isHomePage ? getLogoOpacity() : 1, // Always show black logo on non-home pages
  };

  const getUserInitial = () => {
    if (!user) return "";
    const name = user.displayName || user.email || "";
    return name.charAt(0).toUpperCase();
  };

  // User button styling based on page and scroll position
  const getUserButtonStyle = () => {
    if (!isHomePage) {
      return "border-black text-black";
    }
    return scrollPosition > 100 
      ? "border-black text-black"
      : "border-white text-white";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white bg-opacity-20 border-b border-white border-opacity-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        
        {/* Left side links */}
        <ul className="flex space-x-8 text-lg items-center flex-1">
          {["Home", "Tracker"].map((label, index) => {
            const path = label === "Home" ? "/" : `/${label.toLowerCase()}`;
            return (
              <li key={index} className="group relative cursor-pointer" style={linkStyle}>
                <Link to={path}>
                  {label}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Centered Logo */}
        <div className="relative w-full h-10">
          <Link to="/" className="relative w-full h-10 flex items-center justify-center">
            {/* White logo - only shows on home page when not scrolled */}
            <img
              src={whitelogo}
              alt="White Logo"
              className="h-10 w-auto cursor-pointer"
              style={logoStyle}
            />
            {/* Black logo - shows on scroll (home page) or always (other pages) */}
            <img
              src={logo}
              alt="Original Logo"
              className="h-10 w-auto cursor-pointer"
              style={blackLogoStyle}
            />
          </Link>
        </div>

        {/* Right side links */}
        <ul className="flex space-x-8 text-lg items-center flex-1 justify-end">
          <li className="group relative cursor-pointer" style={linkStyle}>
            <Link to="/contact">
              Contact
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
          </li>

          {!user && (
            <li className="group relative cursor-pointer" style={linkStyle}>
              <Link to="/login">
                Login
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
              </Link>
            </li>
          )}

          {user && (
            <li className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center justify-center rounded-full bg-transparent w-10 h-10 font-bold select-none border transition-colors duration-300 ${getUserButtonStyle()}`}
                title={user.displayName || user.email}
                aria-label="User menu"
              >
                {getUserInitial()}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 text-black z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="truncate font-semibold">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;