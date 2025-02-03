import React, { useEffect, useState } from 'react';

const Loading: React.FC = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWidth((prevWidth) => {
        if (prevWidth < 100) {
          return prevWidth + 3.15;
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 50); // Adjust speed by changing the interval

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <div className="text-3xl font-bold text-white mb-6 animate-pulse">Loading...</div>
      <div className="w-3/4 bg-gray-300 rounded-full h-4 relative overflow-hidden shadow-xl">
        <div
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-full transition-all duration-300 ease-in-out"
          style={{
            width: `${width}%`,
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Loading;
