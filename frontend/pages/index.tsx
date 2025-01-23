import React, { useEffect, useState } from 'react';
import Loading from './loading';
import Navbar from '@/components/navbar';

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <div className="p-6 text-center">
        <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
        <p className="mt-4">This is the main content of the home page.</p>
      </div>
    </>
  );
};

export default Home;