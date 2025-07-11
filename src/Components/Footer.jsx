import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-green-400">MAHI</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your Personal AI-Powered Mental Health Companion. Supporting your mental well-being with personalized, empathetic assistance 24/7.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <a 
                href="#" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.926 3.708 13.775 3.708 12.478s.49-2.448 1.297-3.323c.875-.875 2.026-1.365 3.323-1.365s2.448.49 3.323 1.365c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323c-.875.875-2.026 1.365-3.323 1.365zm7.718-9.021c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm-3.75 9.75c-1.75 0-3.125-1.375-3.125-3.125s1.375-3.125 3.125-3.125 3.125 1.375 3.125 3.125-1.375 3.125-3.125 3.125z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  AI Chatbot
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  Mood Tracker
                </Link>
              </li>
              <li>
                <Link to="/meditation" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  Meditation
                </Link>
              </li>
              <li>
                <Link to="/cbt" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  CBT Exercises
                </Link>
              </li>
              <li>
                <Link to="/resource" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400">Important</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/crisis" className="text-gray-300 hover:text-red-400 transition-colors duration-300 text-sm">
                  Crisis Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                  Disclaimer
                </Link>
              </li>
            </ul>
            
            {/* Emergency Notice */}
            <div className="bg-red-900 bg-opacity-50 p-3 rounded-lg border border-red-700 mt-4">
              <p className="text-red-300 text-xs font-medium">
                🚨 Emergency: If you're having thoughts of self-harm, please contact emergency services immediately or call a crisis helpline.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4 md:px-16 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Stay Connected</h3>
              <p className="text-gray-300 text-sm">Get mental health tips and updates delivered to your inbox</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-r-0"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-r-lg transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-16 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-2 md:mb-0">
              © 2024 MAHI. All rights reserved. | Made with ❤️ for mental wellness
            </p>
            <div className="flex space-x-4 text-xs text-gray-400">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Last updated: July 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Bar */}
      <div className="bg-yellow-900 bg-opacity-20 border-t border-yellow-800">
        <div className="container mx-auto px-4 md:px-16 py-2">
          <p className="text-yellow-300 text-xs text-center">
            <strong>Disclaimer:</strong> MAHI is not a replacement for professional mental health care. If you're experiencing a mental health crisis, please seek immediate professional help.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;