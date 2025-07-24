import React from 'react';
import { Shield, Mail, Heart } from 'lucide-react';

export default function Footer({ onPrivacyClick, onAboutClick, onTermsClick, onContactClick }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">CoachIQ</h3>
              <p className="text-sm text-gray-500">AI-Powered Interview Coaching</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <button onClick={onAboutClick} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              About Us
            </button>
            <button onClick={onTermsClick} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Terms
            </button>
            <button onClick={onPrivacyClick} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Privacy
            </button>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              © {currentYear} CoachIQ. Made with <Heart className="w-4 h-4 text-red-500" /> for job seekers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}