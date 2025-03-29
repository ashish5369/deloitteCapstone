import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { TextInput, Textarea, NumberInput, Button, Modal, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import useAuthStore from '../../store/authStore';

function VendorEvents() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    capacity: 0,
    price: 0,
    images: []
  });

  const { data: vendorEvents, isLoading } = useQuery({
    queryKey: ['vendorEvents', user?.id],
    queryFn: () => axios.get(`http://localhost:5000/api/events/vendor`).then(res => res.data),
    enabled: !!user?.id
  });

  const createEventMutation = useMutation({
    mutationFn: (newEvent) => axios.post(`http://localhost:5000/api/events`, newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorEvents', user?.id]);
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        venue: '',
        capacity: 0,
        price: 0,
        images: []
      });
      notifications.show({
        title: 'Success',
        message: 'Event created successfully',
        color: 'green'
      });
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId) => axios.delete(`http://localhost:5000/api/events/${eventId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorEvents', user?.id]);
      notifications.show({
        title: 'Success',
        message: 'Event deleted successfully',
        color: 'green'
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createEventMutation.mutate({ ...formData, vendorId: user.id });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
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
          <span>Add New Event</span>
        </Button>
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
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
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
              loading={createEventMutation.isLoading}
            >
              Create Event
            </Button>
          </Group>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendorEvents?.map((event) => (
          <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {event.images?.[0] && (
              <img
                src={event.images[0]}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-2">{event.description}</p>
              <div className="text-sm text-gray-500">
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Venue: {event.venue?.name}</p>
                <p>Capacity: {event.capacity}</p>
                <p>Price: ${event.price}</p>
                <p>Status: {event.status}</p>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default VendorEvents;