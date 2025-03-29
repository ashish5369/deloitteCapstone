import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { TextInput, NumberInput, Select, Button, Modal, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { PieChart } from 'react-minimal-pie-chart';
import useAuthStore from '../../store/authStore';

function VendorFinance() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    eventId: '',
    category: '',
    amount: 0,
    description: '',
  });

  // Fetch vendor's events
  const { data: events } = useQuery({
    queryKey: ['vendorEvents', user?.id],
    queryFn: () =>
      axios
        .get(`http://localhost:5000/api/events/vendor`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => res.data),
    enabled: !!user?.id,
  });

  // Fetch expenses and budget tracking for the selected event
  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses', selectedEvent],
    queryFn: () =>
      selectedEvent
        ? axios
          .get(`http://localhost:5000/api/finance/event/${selectedEvent}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
          .then((res) => res.data)
        : null,
    enabled: !!selectedEvent,
  });

  // Mutation to add a new expense
  const addExpenseMutation = useMutation({
    mutationFn: (newExpense) =>
      axios.post('http://localhost:5000/api/finance', newExpense, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses', selectedEvent]);
      setIsModalOpen(false);
      setFormData({
        eventId: selectedEvent,
        category: '',
        amount: 0,
        description: '',
      });
      notifications.show({
        title: 'Success',
        message: 'Expense added successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to add expense',
        color: 'red',
      });
    },
  });

  // Mutation to delete an expense
  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId) =>
      axios.delete(`http://localhost:5000/api/finance/${expenseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses', selectedEvent]);
      // notifications.show({
      //   title: 'Success',
      //   message: 'Expense deleted successfully',
      //   color: 'green',
      // });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to delete expense',
        color: 'red',
      });
    },
  });

  const categoryColors = {
    Venue: '#4CAF50', // Green
    Catering: '#FF9800', // Orange
    Decoration: '#9C27B0', // Purple
    Marketing: '#2196F3', // Blue
    Staff: '#FFC107', // Yellow
    Equipment: '#F44336', // Red
    Other: '#607D8B', // Gray
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add the selected event ID to the request body
    addExpenseMutation.mutate({
      ...formData,
      eventId: selectedEvent,
    });
  };

  const handleDeleteExpense = (expenseId) => {
    deleteExpenseMutation.mutate(expenseId);
  };

  const getPieChartData = () => {
    if (!expenses?.expenses) return [];

    const categoryTotals = expenses.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([category, value]) => ({
      title: category,
      value,
      color: categoryColors[category],
    }));
  };

  if (isLoading) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Finance Management</h1>
        <Select
          placeholder="Select Event"
          data={
            events?.map((event) => ({
              value: event._id,
              label: event.title,
            })) || []
          }
          value={selectedEvent}
          onChange={setSelectedEvent}
          className="w-64"
        />
      </div>

      {selectedEvent && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Budget Overview</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Total Budget:</span> ${expenses?.budget || 0}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Total Expenses:</span> ${expenses?.totalExpenses || 0}
                </p>
                <p
                  className={`font-bold ${expenses?.isOverBudget ? 'text-red-500' : 'text-green-500'
                    }`}
                >
                  <span className="font-medium">Remaining:</span> ${expenses?.remainingBudget || 0}
                </p>
              </div>
              {expenses?.isOverBudget && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                  Warning: You have exceeded the budget!
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Expense Distribution</h2>
              <div className="w-64 h-64 mx-auto">
                <PieChart
                  data={getPieChartData()}
                  label={({ dataEntry }) =>
                    `${dataEntry.title} (${Math.round(dataEntry.percentage)}%)`
                  }
                  labelStyle={{ fontSize: '5px', fill: '#fff' }}
                  radius={42}
                  labelPosition={112}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Expenses</h2>
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
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded"
            >
              Add Expense
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses?.expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{expense.category}</td>
                    <td className="px-6 py-4 text-gray-700">{expense.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      ${expense.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <Button
                        onClick={() => handleDeleteExpense(expense._id)}
                        styles={{
                          root: {
                            backgroundColor: 'red', // Purple background
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
                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}

        title="Add New Expense"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            required
            label="Category"
            data={[
              { value: 'Venue', label: 'Venue' },
              { value: 'Catering', label: 'Catering' },
              { value: 'Decoration', label: 'Decoration' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Staff', label: 'Staff' },
              { value: 'Equipment', label: 'Equipment' },
              { value: 'Other', label: 'Other' },
            ]}
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
          />

          <NumberInput
            required
            label="Amount"
            value={formData.amount}
            onChange={(value) => setFormData({ ...formData, amount: value })}
            min={0}
            precision={2}
          />

          <TextInput
            required
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Group position="right" mt="md">
            <Button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
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
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded"
              loading={addExpenseMutation.isLoading}

            >
              Add Expense
            </Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
}

export default VendorFinance;