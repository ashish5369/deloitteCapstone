import React from 'react';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upcoming Events Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
            <p className="text-lg">No upcoming events</p>
          </div>

          {/* Recent Activities Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
            <p className="text-lg">No recent activities</p>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
            <p className="text-lg">No stats available</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;