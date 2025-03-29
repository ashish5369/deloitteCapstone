import React from 'react';
import useAuthStore from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function VendorProfile() {
  const { user } = useAuthStore();

  const { data: vendorEvents } = useQuery({
    queryKey: ['vendorEvents', user?.id],
    queryFn: () =>
      axios
        .get('http://localhost:5000/api/events/vendor', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => res.data),
    enabled: !!user?.id,
  });

  // Generate random numbers for followers and rating
  const randomFollowers = Math.floor(Math.random() * 1000) + 1; // Random number between 1 and 1000
  const randomRating = Math.floor(Math.random() * 5) + 1; // Random whole number between 1 and 5

  if (!user) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header Section */}
      <div className="flex items-center space-x-6 mb-8">
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg" // Updated avatar image
          alt="Vendor Avatar"
          className="w-32 h-32 rounded-full shadow-md"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold text-purple-600">{vendorEvents?.length || 0}</p>
          <p className="text-gray-600">Events</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold text-purple-600">{randomFollowers}</p>
          <p className="text-gray-600">Followers</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold text-purple-600">{randomRating} / 5</p>
          <p className="text-gray-600">Rating</p>
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-8">
        <div className="flex flex-wrap">
          {user.services?.map((service, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Edit Profile Button */}
      <div>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default VendorProfile;