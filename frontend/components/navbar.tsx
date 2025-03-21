import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHome, faUser, faTag, faMoon, faSun, faBars } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/context/themeContext';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token); // Set to true if token exists
    setIsAdmin(!!adminToken); // Set to true if admin token exists
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    setIsAuthenticated(false); // Update authentication state
    router.push('/auth/login'); // Redirect to login page
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    setIsAdmin(false);
    router.push('/auth/admin/login');
  };

  return (
    <nav className={`bg-opacity-80 backdrop-filter backdrop-blur-xl shadow-md ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="text-2xl font-extrabold">
          <Link href="/" className="hover:text-indigo-600 transition duration-300">
            WhatisMyEmotion
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex md:space-x-6 font-medium items-center">
          <li>
            <Link href="/emotion" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faTag} /><span className='ml-2'>Emotion</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faUser} /><span className='ml-2'>Dashboard</span>
            </Link>
          </li>
          
          {isAdmin && (
            <li>
              <Link href="/admin/dashboard" className="hover:text-indigo-600 transition duration-300">
                <FontAwesomeIcon icon={faUser} /><span className='ml-2'>Admin Panel</span>
              </Link>
            </li>
          )}
          
          {isAdmin ? (
            <li>
              <button onClick={handleAdminLogout} className="hover:text-indigo-600 transition duration-300">
                Admin Logout
              </button>
            </li>
          ) : isAuthenticated ? (
            <li>
              <button onClick={handleLogout} className="hover:text-indigo-600 transition duration-300">
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link href="/auth/login" className="hover:text-indigo-600 transition duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/admin/login" className="hover:text-indigo-600 transition duration-300">
                  Admin Login
                </Link>
              </li>
            </>
          )}
          
          <li>
            <button onClick={toggleTheme} className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </button>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <ul className={`md:hidden flex flex-col space-y-4 font-medium items-center ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-800'} bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-md py-4`}>
          <li>
            <Link href="/" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faHome} /><span className='ml-2'>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/emotion" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faTag} /><span className='ml-2'>Emotion</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faUser} /><span className='ml-2'>Dashboard</span>
            </Link>
          </li>
          
          {isAdmin && (
            <li>
              <Link href="/admin/dashboard" className="hover:text-indigo-600 transition duration-300">
                <FontAwesomeIcon icon={faUser} /><span className='ml-2'>Admin Panel</span>
              </Link>
            </li>
          )}
          
          {isAdmin ? (
            <li>
              <button onClick={handleAdminLogout} className="hover:text-indigo-600 transition duration-300">
                Admin Logout
              </button>
            </li>
          ) : isAuthenticated ? (
            <li>
              <button onClick={handleLogout} className="hover:text-indigo-600 transition duration-300">
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link href="/auth/login" className="hover:text-indigo-600 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/admin/login" className="hover:text-indigo-600 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                  Admin Login
                </Link>
              </li>
            </>
          )}
          
          <li>
            <button onClick={toggleTheme} className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;