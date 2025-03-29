import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

function CustomerProfile() {
  const { user } = useAuthStore();

  const { data: userEvents, isLoading } = useQuery({
    queryKey: ['userEvents', user?.id],
    queryFn: () => axios.get(`http://localhost:5000/api/events/registered`).then((res) => res.data),
    enabled: !!user?.id,
  });

  const eventPlaceholderImages = [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Concert
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Festival
    'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Crowd
    'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Stage
    'https://images.unsplash.com/photo-1515169067865-5387ec356754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Lights
  ];

  if (isLoading) return <div className="text-center text-gray-600">Loading...</div>;

  // Sort events: upcoming events first, past events last
  const sortedEvents = userEvents?.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header Section */}
      <div className="flex items-center space-x-6 mb-8">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Customer Avatar"
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
          <p className="text-2xl font-bold text-purple-600">{userEvents?.length || 0}</p>
          <p className="text-gray-600">Registered Events</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold text-purple-600">{Math.floor(Math.random() * 1000) + 1}</p>
          <p className="text-gray-600">Followers</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold text-purple-600">{Math.floor(Math.random() * 5) + 1} / 5</p>
          <p className="text-gray-600">Rating</p>
        </div>
      </div>

      {/* Registered Events Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Registered Events</h2>
        <div className="space-y-6">
          {sortedEvents?.map((event, index) => {
            const isPastEvent = new Date(event.date) < new Date();
            return (
              <div
                key={event._id}
                className={`bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 ${isPastEvent ? 'opacity-50' : ''
                  }`}
              >
                <img
                  src={event.images?.[0] || eventPlaceholderImages[index % eventPlaceholderImages.length]}
                  alt={event.title || 'Event Image'}
                  className="w-full sm:w-48 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(event.date).toLocaleDateString()} | {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{event.venue?.name || 'Venue not specified'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Tickets: {event.tickets || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Price: ${event.price || 'Free'}</p>
                </div>
              </div>
            );
          })}
          {(!userEvents || userEvents.length === 0) && (
            <p className="text-gray-600">You haven't registered for any events yet.</p>
          )}
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

export default CustomerProfile;