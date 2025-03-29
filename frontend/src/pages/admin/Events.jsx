import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { TextInput, Textarea, NumberInput, Button, Modal, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';

function Events() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 0,
    price: 0,
    images: [],
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => axios.get('http://localhost:5000/api/events').then((res) => res.data),
  });

  const createEventMutation = useMutation({
    mutationFn: (newEvent) => axios.post('http://localhost:5000/api/events', newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: 0,
        price: 0,
        images: [],
      });
      notifications.show({
        title: 'Success',
        message: 'Event created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create event',
        color: 'red',
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId) => axios.delete(`http://localhost:5000/api/events/${eventId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      notifications.show({
        title: 'Success',
        message: 'Event deleted successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to delete event',
        color: 'red',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.location ||
      !formData.capacity ||
      !formData.price
    ) {
      notifications.show({
        title: 'Error',
        message: 'Please fill in all required fields',
        color: 'red',
      });
      return;
    }
    createEventMutation.mutate(formData);
  };

  if (eventsLoading) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Events Management</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
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
          >
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>+</span>
            <span>Create Event</span>
          </Button>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="text-sm text-gray-500">
                <p>
                  <span className="font-semibold">Date:</span>{' '}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Location:</span> {event.location}
                </p>
                <p>
                  <span className="font-semibold">Capacity:</span> {event.capacity}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> ${event.price}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Registered Users:</h3>
                {event.registeredAttendees?.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {event.registeredAttendees.map((attendee) => (
                      <li key={attendee.userId._id} className="text-gray-700">
                        {attendee.userId.name} ({attendee.userId.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No users registered for this event.</p>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  color="red"
                  variant="subtle"
                  onClick={() => deleteEventMutation.mutate(event._id)}
                >
                  Delete Event
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Adding New Event */}
        <Modal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Event"
          size="lg"
          zIndex={1000}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              required
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Textarea
              required
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextInput
              required
              type="datetime-local"
              label="Event Date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <TextInput
              required
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <NumberInput
              required
              label="Capacity"
              value={formData.capacity}
              onChange={(value) => setFormData({ ...formData, capacity: value })}
              min={1}
            />
            <NumberInput
              required
              label="Price"
              value={formData.price}
              onChange={(value) => setFormData({ ...formData, price: value })}
              min={0}
              precision={2}
            />
            <Textarea
              label="Images (comma-separated URLs)"
              value={formData.images.join(', ')}
              onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',').map((url) => url.trim()) })}
            />
            <Group position="right" mt="md">
              <Button
                type="button"
                className="bg-gray-500 text-white hover:bg-gray-600 transition duration-300"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                loading={createEventMutation.isLoading}
              >
                Create Event
              </Button>
            </Group>
          </form>
        </Modal>
      </div>
    </div>
  );
}

export default Events;