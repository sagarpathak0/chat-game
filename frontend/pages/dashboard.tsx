import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/navbar';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(false);
      const timeout = setTimeout(() => {
        router.push('/auth/login');
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [router]);

  if (!user) {
    return <div className="p-6 text-center">Redirecting to login...</div>;
  }

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
