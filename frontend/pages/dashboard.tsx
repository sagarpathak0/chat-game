import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import Loading from "../components/loading";
import { useTheme } from "@/context/themeContext";
import Link from "next/link";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const { isDarkMode } = useTheme();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem('adminToken');
    const name = localStorage.getItem('name') || localStorage.getItem('userName') || 'User';
    
    if (!token) {
      router.push('/auth/login');
    } else if (adminToken) {
      // If admin is trying to access user page
      alert("This page is for regular users only. Redirecting to admin dashboard.");
      router.push('/admin/dashboard');
    } else {
      setUserName(name);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <div
        className={`flex flex-col items-center pt-28 min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        <div
          className={`w-full max-w-4xl mt-2 p-8 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } bg-opacity-90 rounded-lg shadow-lg`}
        >
          <h2 className="text-4xl font-bold text-center mb-6">
            Welcome{" "}
            {userName
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h2>
          <p className="text-center text-lg mb-4">
            This is your dashboard. Here you can manage your account, view your
            activities, and much more.
          </p>
          <div className="flex justify-center">
            <Link
              href="emotion"
              className={`mt-8 px-8 py-4 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
                  : "bg-gradient-to-r from-blue-500 via-green-500 to-teal-500"
              }`}
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
