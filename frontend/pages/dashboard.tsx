import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/navbar';
import Loading from './loading';
import { useTheme } from '@/context/themeContext';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(true);
      setLoading(false);
    } else {
      setUser(false);
      const timeout = setTimeout(() => {
        router.push('/auth/login');
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <div className="p-6 text-center">Redirecting to login...</div>;
  }

  const username = localStorage.getItem('name') || 'User';

  return (
    <>
      <Navbar />
      <div
        className={`flex flex-col items-center pt-28 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
      >
        <div className={`w-full max-w-4xl mt-2 p-8 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} bg-opacity-90 rounded-lg shadow-lg`}>
          <h2 className="text-4xl font-bold text-center mb-6">
            Welcome {username.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
          </h2>
          <p className="text-center text-lg mb-4">
            This is your dashboard. Here you can manage your account, view your activities, and much more.
          </p>
          <div className="flex justify-center">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;