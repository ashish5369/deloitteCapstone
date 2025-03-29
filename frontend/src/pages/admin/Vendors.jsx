import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function Vendors() {
  const { data: vendors, isLoading, error } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => axios.get('http://localhost:5000/api/events/vendors').then((res) => res.data),
  });

  if (isLoading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Vendors Management</h1>
        </div>

        {/* Vendors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors?.map((vendor) => (
            <div
              key={vendor._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{vendor.name}</h2>
              <div className="text-sm text-gray-500">
                <p>
                  <span className="font-semibold">Email:</span> {vendor.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {vendor.phone || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Created At:</span>{' '}
                  {new Date(vendor.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Vendors;