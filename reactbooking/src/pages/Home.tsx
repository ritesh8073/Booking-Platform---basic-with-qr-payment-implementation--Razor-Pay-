import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Book Your Next Appointment with Ease
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Simple, fast, and secure booking platform for all your needs
        </p>
        {!user && (
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Calendar className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
          <p className="text-gray-600">
            Book appointments with just a few clicks. Choose your preferred date and time.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Clock className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Real-time Availability</h3>
          <p className="text-gray-600">
            See available slots instantly and get immediate confirmation.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <MapPin className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Location Flexibility</h3>
          <p className="text-gray-600">
            Choose from multiple locations or opt for online meetings.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      {user && (
        <div className="bg-blue-50 p-8 rounded-lg text-center my-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to make a booking?
          </h2>
          <Link
            to="/bookings"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            View Available Slots
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;