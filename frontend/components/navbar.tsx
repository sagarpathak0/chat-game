import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faHome, faUser, faPhone, faTag, faMoon, faSun, faBars } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/context/themeContext';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Set to true if token exists
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    setIsAuthenticated(false); // Update authentication state
    router.push('/auth/login'); // Redirect to login page
  };

  return (
    <nav className={`bg-opacity-80 backdrop-filter backdrop-blur-xl shadow-md ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="text-2xl font-extrabold">
          <Link href="/" className="hover:text-indigo-600 transition duration-300">
            ShopMate
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex md:space-x-6 font-medium items-center">
          <li>
            <Link href="/" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faHome} /><span className='ml-2'>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/shop" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faTag} /><span className='ml-2'>Shop</span>
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faPhone} /><span className='ml-2'>Contact</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faUser} /><span className='ml-2'>Dashboard</span>
            </Link>
          </li>
          {isAuthenticated ? (
            <li>
              <button onClick={handleLogout} className="hover:text-indigo-600 transition duration-300">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link href="/auth/login" className="hover:text-indigo-600 transition duration-300">
                Login
              </Link>
            </li>
          )}
          <li>
            <Link href="/cart" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
          </li>
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
        <ul className="md:hidden flex flex-col space-y-4 font-medium items-center bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-md py-4">
          <li>
            <Link href="/" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faHome} /><span className='ml-2'>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/shop" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faTag} /><span className='ml-2'>Shop</span>
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faPhone} /><span className='ml-2'>Contact</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:text-indigo-600 transition duration-300">
              <FontAwesomeIcon icon={faUser} /><span className='ml-2'>Dashboard</span>
            </Link>
          </li>
          {isAuthenticated ? (
            <li>
              <button onClick={handleLogout} className="hover:text-indigo-600 transition duration-300">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link href="/auth/login" className="hover:text-indigo-600 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>
            </li>
          )}
          <li>
            <Link href="/cart" className="hover:text-indigo-600 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
          </li>
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