import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function CustomerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: events, isLoading: eventsLoading, error: eventsError } = useQuery({
    queryKey: ['events'],
    queryFn: () => axios.get('http://localhost:5000/api/events').then((res) => res.data),
  });

  const { data: userEvents, isLoading: userEventsLoading, error: userEventsError } = useQuery({
    queryKey: ['userEvents', user?.id],
    queryFn: () =>
      axios.get('http://localhost:5000/api/events/registered', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then((res) => res.data),
    enabled: !!user?.id,
  });

  const registerMutation = useMutation({
    mutationFn: (eventId) =>
      axios.post(
        `http://localhost:5000/api/events/${eventId}/register`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(['userEvents']);
      alert('Successfully registered for the event!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to register for the event.');
    },
  });

  const deregisterMutation = useMutation({
    mutationFn: (eventId) =>
      axios.delete(`http://localhost:5000/api/events/${eventId}/register`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['userEvents']);
      alert('Successfully deregistered from the event!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to deregister from the event.');
    },
  });

  const handleRegister = (eventId) => {
    registerMutation.mutate(eventId);
  };

  const handleDeregister = (eventId) => {
    deregisterMutation.mutate(eventId);
  };

  if (eventsLoading || userEventsLoading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (eventsError || userEventsError) {
    return <div className="text-center text-red-500">Error loading data.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome to Your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Available Events */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Events</h2>
            <div className="space-y-6">
              {events?.map((event) => (
                <div
                  key={event._id}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                      <p className="text-gray-600 mt-2">{event.description}</p>
                      <p className="text-gray-600 mt-2">
                        <span className="font-semibold">Date:</span>{' '}
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Location:</span> {event.location}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Capacity:</span> {event.capacity}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Price:</span> ${event.price}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleRegister(event._id)}
                      styles={{
                        root: {
                          backgroundColor: '#6C63FF', // Purple background
                          color: '#FFFFFF', // White text
                          borderRadius: '8px', // Rounded corners
                          padding: '10px 16px', // Padding
                          fontWeight: '500', // Medium font weight
                          display: 'flex',
                          alignItems: 'center',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Shadow
                          transition: 'background-color 0.3s ease',
                        },
                        label: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px', // Space between "+" and text
                        },
                        '&:hover': {
                          backgroundColor: '#5A54E6', // Darker purple on hover
                        },
                      }}
                      disabled={registerMutation.isLoading}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                      {registerMutation.isLoading ? 'Registering...' : 'Register'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Registered Events */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Registered Events</h2>
            <div className="space-y-6">
              {userEvents?.map((event) => (
                <div
                  key={event._id}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                      <p className="text-gray-600 mt-2">{event.description}</p>
                      <p className="text-gray-600 mt-2">
                        <span className="font-semibold">Date:</span>{' '}
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Location:</span> {event.location}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Capacity:</span> {event.capacity}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Price:</span> ${event.price}
                      </p>
                    </div>
                    <Button
                      color="red"
                      onClick={() => handleDeregister(event._id)}
                      disabled={deregisterMutation.isLoading}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                    >
                      {deregisterMutation.isLoading ? 'Deregistering...' : 'Deregister'}
                    </Button>
                  </div>
                </div>
              ))}
              {(!userEvents || userEvents.length === 0) && (
                <p className="text-gray-600 text-center">You haven't registered for any events yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;