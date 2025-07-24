import React from 'react';
import { X, Crown } from 'lucide-react';

export default function UpgradeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Crown className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upgrade Your Plan</h2>
                <p className="text-gray-600 text-sm">Demo mode - upgrades not available</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            This is a demo version of CoachIQ. In the full version, you would be able to:
          </p>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• Upload resumes for personalized questions</li>
            <li>• Get advanced AI feedback</li>
            <li>• Download PDF reports</li>
            <li>• Access premium features</li>
          </ul>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Continue Demo
          </button>
        </div>
      </div>
    </div>
  );
}