import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import useAuthStore from '../store/authStore';

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values) => {
    try {
      const response = await login(values);

      notifications.show({
        title: 'Success',
        message: 'Welcome back!',
        color: 'green',
      });

      // Redirect based on role
      switch (response.user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'vendor':
          navigate('/vendor');
          break;
        case 'user':
          navigate('/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      // Check if the error is related to an incorrect password
      if (error.response?.data?.message === 'Incorrect password') {
        notifications.show({
          title: 'Error',
          message: 'The password you entered is incorrect.',
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Error',
          message: error.message || 'Login failed',
          color: 'red',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Paper radius="md" p="xl" className="w-full max-w-md">
        <Title order={2} className="text-center mb-6">Welcome back to EventZen</Title>

        <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
          <TextInput
            required
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
          />

          <Button type="submit" fullWidth mt="xl" size="md">
            Sign in
          </Button>
        </form>

        <Text color="dimmed" size="sm" align="center" mt="md">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </Text>
      </Paper>
    </div>
  );
}

export default Login;