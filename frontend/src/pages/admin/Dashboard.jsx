import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaCalendarAlt, FaUserTie, FaUsers } from 'react-icons/fa';



function Dashboard() {
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => axios.get('http://localhost:5000/api/events').then((res) => res.data),
  });

  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => axios.get('http://localhost:5000/api/events/vendors').then((res) => res.data),
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => axios.get('http://localhost:5000/api/events/users').then((res) => res.data),
  });

  // Count the number of users with the role "user"
  const userCount = users?.filter((user) => user.role === 'user').length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Events Card */}
          <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300" >
            <div className="flex items-center mb-4">
              <i className="fas fa-calendar-alt text-blue-600 text-3xl"><FaCalendarAlt /></i>
              <h2 className="text-lg font-semibold text-gray-800 ml-4">Total Events</h2>
            </div>
            <p className="text-4xl font-bold text-blue-600">{events?.length || 0}</p>
          </div>

          {/* Vendors Card */}
          <div className="bg-white border border-purple-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <i className="fas fa-user-tie text-purple-600 text-3xl"><FaUserTie /></i>
              <h2 className="text-lg font-semibold text-gray-800 ml-4">Active Vendors</h2>
            </div>
            <p className="text-4xl font-bold text-purple-600">{vendors?.length || 0}</p>
          </div>

          {/* Users Card */}
          <div className="bg-white border border-green-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <i className="fas fa-users text-green-600 text-3xl"><FaUserTie /></i>
              <h2 className="text-lg font-semibold text-gray-800 ml-4">Registered Users</h2>
            </div>
            <p className="text-4xl font-bold text-green-600">{userCount}</p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
          <p className="text-gray-600">
            Welcome to the admin dashboard. Here, you can monitor the total number of events,
            vendors, and users. Use the navigation menu to manage the platform effectively.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;