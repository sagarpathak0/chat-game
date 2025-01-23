import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/navbar';
import { one, two, three, four } from '@/assets/index';
import Loading from './loading';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<boolean>(false);
  const [bgImageIndex, setBgImageIndex] = useState<number>(0);
  const bgImages = [one, two, three, four];
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(true);
      setLoading(false); // Set loading to false after checking the token
    } else {
      setUser(false);
      const timeout = setTimeout(() => {
        router.push('/auth/login');
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bgImages.length]);

  useEffect(() => {
    console.log('Current background image:', bgImages[bgImageIndex]);
  }, [bgImageIndex, bgImages]);

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
        className="flex justify-center min-h-screen"
        style={{
          backgroundImage: `url(${bgImages[bgImageIndex].src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="w-full max-w-7xl mt-[280px] p-6 h-full rounded-lg shadow-md bg-white bg-opacity-70">
          <h2 className="text-[50px] font-bold text-center mb-6">
            Welcome {username.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
          </h2>
        </div>
      </div>
    </>
  );
};

export default Dashboard;