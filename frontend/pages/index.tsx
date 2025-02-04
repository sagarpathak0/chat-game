import React, { useEffect, useState } from "react";
import Loading from "../components/loading";
import Navbar from "../components/navbar";
import { useTheme } from "../context/themeContext";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight-new"; // Import the SpotlightNew component
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { isDarkMode } = useTheme();
  const words = [
    {
      text: "Welcome",
    },
    {
      text: "To",
    },
    {
      text: "The",
    },
    {
      text: "Home",
    },
    {
      text: "Page.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  useEffect(() => {
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
      <div
        className={`p-6 md:px-24 lg:px-48 overflow-x-hidden ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        <div className="flex flex-col justify-center items-center h-screen">
          {/* <h1
            className={`text-5xl lg:text-[70px] text-center font-bold relative w-[max-content] font-mono before:absolute before:inset-0 before:animate-typewriter after:absolute after:inset-0 after:w-[0.125em] after:animate-caret ${
              isDarkMode
                ? "before:bg-gray-900 after:bg-white"
                : "before:bg-gray-100 after:bg-gray-900"
            }`}
          >
            WELCOME TO THE HOME PAGE
          </h1> */}
          <TypewriterEffect words={words} />
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
        <div className="mt-12 w-full overflow-x-hidden">
          <Spotlight />
        </div>
      </div>
    </>
  );
};

export default Home;
