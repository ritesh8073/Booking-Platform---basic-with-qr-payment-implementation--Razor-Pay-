import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Home, Calendar, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Menu className="h-6 w-6 text-gray-600 mr-2" />
            <Link to="/" className="text-xl font-semibold text-gray-800">
              Booking Platform
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            
            {user ? (
              <>
                <Link to="/bookings" className="flex items-center text-gray-600 hover:text-gray-900">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span>Bookings</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center text-gray-600 hover:text-gray-900">
                  <LogIn className="h-5 w-5 mr-1" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="flex items-center text-gray-600 hover:text-gray-900">
                  <UserPlus className="h-5 w-5 mr-1" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;