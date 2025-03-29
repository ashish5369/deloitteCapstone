import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaTicketAlt } from 'react-icons/fa';
import useAuthStore from '../../store/authStore';

function CustomerBookings() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch registered events
  const { data: userEvents, isLoading, error } = useQuery({
    queryKey: ['userEvents', user?.id],
    queryFn: () =>
      axios.get('http://localhost:5000/api/events/registered', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then((res) => res.data),
    enabled: !!user?.id, // Only fetch if user ID exists
  });

  // Mutation to deregister from an event
  const deregisterMutation = useMutation({
    mutationFn: (eventId) =>
      axios.delete(`http://localhost:5000/api/events/${eventId}/register`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['userEvents']); // Refresh registered events
      alert('Successfully deregistered from the event!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to deregister from the event.');
    },
  });

  const handleDeregister = (eventId) => {
    deregisterMutation.mutate(eventId);
  };

  if (isLoading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Bookings</h1>

        <div className="space-y-6">
          {userEvents?.map((event, index) => (
            <div
              key={event._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md flex items-center justify-between p-6"
            >
              {/* Left Section */}
              <div className="flex-1">
                {/* Ticket Header */}
                <div className="flex items-center mb-4">
                  <FaTicketAlt className="text-purple-600 text-2xl mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">Ticket {index + 1}</h3>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-4 gap-6 text-gray-800 text-base">
                  <div>
                    <p className="font-semibold text-gray-600">Event:</p>
                    <p>{event.title}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Date:</p>
                    <p>{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Location:</p>
                    <p>{event.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Price:</p>
                    <p>${event.price || 'Free'}</p>
                  </div>
                </div>

                {/* Deregister Button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleDeregister(event._id)}
                    disabled={deregisterMutation.isLoading}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                  >
                    {deregisterMutation.isLoading ? 'Deregistering...' : 'Deregister'}
                  </button>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg shadow-inner w-48">
                <div className="text-center mb-4">
                  <p className="text-sm font-semibold text-gray-500">Code</p>
                  <p className="text-blue-600 font-bold">{`TICKET-${event._id.slice(-6).toUpperCase()}`}</p>
                </div>
                <div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${event._id}`}
                    alt="QR Code"
                    className="w-24 h-24"
                  />
                </div>
              </div>
            </div>
          ))}
          {(!userEvents || userEvents.length === 0) && (
            <p className="text-gray-600 text-center">You haven't registered for any events yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerBookings;