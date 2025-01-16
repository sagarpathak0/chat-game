import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/navbar';

const Dashboard: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Check for the token in localStorage
    const token = localStorage.getItem('token');
    
    // If there's no token, redirect the user to the login page
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </>
  );
};

export default Dashboard;
