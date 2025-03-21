import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/navbar';
import { useTheme } from '@/context/themeContext';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [adminName, setAdminName] = useState<string>('');
  const router = useRouter();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');
    const name = localStorage.getItem('adminName');
    
    if (!adminToken) {
      router.push('/auth/admin/login');
    } else if (userToken && !adminToken) {
      // If regular user trying to access admin page
      alert("This page is for administrators only. Redirecting to user dashboard.");
      router.push('/dashboard');
    } else {
      setAdminName(name || 'Admin');
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    router.push('/auth/admin/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className={`min-h-screen p-6 md:p-12 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-md mb-8">
            <p className="text-white text-xl">Welcome, {adminName}!</p>
            <p className="text-white opacity-80 mt-2">You are logged in as an administrator.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-3">User Management</h2>
              <p className="text-gray-500 dark:text-gray-400">Manage all registered users in the system</p>
            </div>
            
            <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-3">Emotion Data</h2>
              <p className="text-gray-500 dark:text-gray-400">View and analyze emotion detection data</p>
            </div>
            
            <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-3">System Settings</h2>
              <p className="text-gray-500 dark:text-gray-400">Configure application settings and parameters</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
