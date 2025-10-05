import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  PhotoIcon,
  UserIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/gallery" className="flex items-center space-x-2">
              <HeartIcon className="h-8 w-8 text-pink-500" />
              <span className="text-xl font-bold text-gray-900">Family Moments</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/gallery"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <PhotoIcon className="h-5 w-5" />
              <span>Gallery</span>
            </Link>

            <Link
              to="/upload"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Upload</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <UserIcon className="h-5 w-5" />
              <span>Profile</span>
            </Link>

            <div className="flex items-center space-x-2 px-3 py-2">
              <span className="text-sm text-gray-600">
                Hi, {user.firstName}
              </span>
              {user.familyCode && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  Family: {user.familyCode}
                </span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;