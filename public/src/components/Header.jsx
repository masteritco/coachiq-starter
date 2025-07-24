import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';

const Header = ({ onSettingsClick, onAboutClick, onAuthClick, onHomeClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and title */}
          <button 
            onClick={onHomeClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            title="Go to Home"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CoachIQ</h1>
              <p className="text-sm text-gray-500">AI-Powered Interview Coaching</p>
            </div>
          </button>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onAboutClick}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              About Us
            </button>
            <button
              onClick={onAuthClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
