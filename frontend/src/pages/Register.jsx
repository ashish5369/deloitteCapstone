import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      role: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
      name: (value) => (!value ? 'Name is required' : null),
      phone: (value) => (!value ? 'Phone number is required' : null),
      role: (value) => (!value ? 'Please select a role' : null),
    },
  });

  const handleSubmit = async (values) => {
    try {
      const { confirmPassword, ...registrationData } = values;

      await axios.post('http://localhost:5000/api/auth/register', registrationData);

      notifications.show({
        title: 'Success',
        message: 'Registration successful! Please login.',
        color: 'green',
      });
      navigate('/login');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Registration failed',
        color: 'red',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Paper radius="md" p="xl" className="w-full max-w-md">
        <Title order={2} className="text-center mb-6">Create your account</Title>

        <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
          <TextInput
            required
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />

          <TextInput
            required
            label="Full Name"
            placeholder="John Doe"
            {...form.getInputProps('name')}
          />

          <TextInput
            required
            label="Phone Number"
            placeholder="123-456-7890"
            {...form.getInputProps('phone')}
          />

          <Select
            required
            label="Register as"
            placeholder="Select your role"
            data={[
              { value: 'user', label: 'User' },
              { value: 'vendor', label: 'Vendor' }
            ]}
            {...form.getInputProps('role')}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Create a password"
            {...form.getInputProps('password')}
          />

          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Confirm your password"
            {...form.getInputProps('confirmPassword')}
          />

          <Button type="submit" fullWidth mt="xl" size="md">
            Register
          </Button>
        </form>

        <Text color="dimmed" size="sm" align="center" mt="md">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </Text>
      </Paper>
    </div>
  );
}

export default Register;