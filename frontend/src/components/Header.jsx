import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { FaBell } from 'react-icons/fa';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end items-center space-x-6">
        {/* Notification Icon */}
        <FaBell className="text-gray-600 text-xl cursor-pointer hover:text-gray-800" />

        {/* User Info */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src="https://i.pravatar.cc/32"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-sm">
                <p className="text-gray-800 font-medium">{user.name || 'User Name'}</p>
                <p className="text-gray-500">{user.company || 'YourCompany'}</p>
              </div>
            </div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;