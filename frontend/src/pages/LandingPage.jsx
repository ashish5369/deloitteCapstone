import React from 'react';
import { Link } from 'react-router-dom';
import { IconCalendarEvent, IconMapPin, IconUsers } from '@tabler/icons-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-wide">EventZen</h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 rounded-full bg-white text-indigo-600 font-medium hover:bg-gray-100 transition-all shadow-md"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 rounded-full border-2 border-white text-white font-medium hover:bg-white hover:text-indigo-600 transition-all shadow-md"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-extrabold mb-6 leading-tight">
            Discover Amazing <span className="text-yellow-300">Events</span> Near You
          </h2>
          <p className="text-2xl text-gray-200 mb-8">
            Join our platform to find and book the perfect events for you.
          </p>
          <Link
            to="/register"
            className="px-10 py-4 bg-yellow-300 text-indigo-600 rounded-full text-lg font-semibold hover:bg-yellow-400 transition-all shadow-lg"
          >
            Get Started
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg hover:scale-105 transition-transform">
            <IconCalendarEvent size={56} className="mb-4 text-yellow-300" />
            <h3 className="text-2xl font-semibold mb-2">Browse Events</h3>
            <p className="text-gray-200">
              Discover a wide range of events happening in your area.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg hover:scale-105 transition-transform">
            <IconMapPin size={56} className="mb-4 text-yellow-300" />
            <h3 className="text-2xl font-semibold mb-2">Find Venues</h3>
            <p className="text-gray-200">
              Explore amazing venues perfect for any occasion.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg hover:scale-105 transition-transform">
            <IconUsers size={56} className="mb-4 text-yellow-300" />
            <h3 className="text-2xl font-semibold mb-2">Connect</h3>
            <p className="text-gray-200">
              Join a community of event enthusiasts and make connections.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-600 py-6 mt-20">
        <div className="container mx-auto text-center text-gray-200">
          <p className="text-sm">
            © {new Date().getFullYear()} EventZen. All rights reserved.
          </p>
          <p className="text-sm mt-2">Created by Ashish</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;