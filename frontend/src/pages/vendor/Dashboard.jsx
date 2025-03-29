import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

function VendorDashboard() {
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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Vendor Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Events Overview */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Events Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Events</span>
                <span className="text-2xl font-bold text-purple-600">
                  {vendorEvents?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Events</span>
                <span className="text-2xl font-bold text-purple-600">
                  {vendorEvents?.filter((event) => event.status === 'upcoming').length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Bookings</h2>
            <div className="space-y-4">
              {vendorEvents?.slice(0, 5).map((event) => (
                <div key={event._id} className="border-b pb-2">
                  <h3 className="font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {(!vendorEvents || vendorEvents.length === 0) && (
                <p className="text-gray-600">No recent events</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;