import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function Events() {
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => axios.get('http://localhost:5000/api/events').then(res => res.data)
  });

  const createEventMutation = useMutation({
    mutationFn: (newEvent) => axios.post('http://localhost:5000/api/events', newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, ...data }) => axios.put(`http://localhost:5000/api/events/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      setSelectedEvent(null);
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id) => axios.delete(`http://localhost:5000/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Events Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events?.map((event) => (
          <div key={event._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-2">{event.description}</p>
            <div className="text-sm text-gray-500">
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
              <p>Capacity: {event.capacity}</p>
              <p>Price: ${event.price}</p>
              <p>Status: {event.status}</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setSelectedEvent(event)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteEventMutation.mutate(event._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;