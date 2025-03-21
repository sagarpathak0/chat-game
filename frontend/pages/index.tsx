// import React, { useEffect, useState } from "react";
// import Loading from "../components/loading";
// import Navbar from "../components/navbar";
// import { useTheme } from "../context/themeContext";
// import Link from "next/link";
// import { Spotlight } from "@/components/ui/spotlight-new"; // Import the SpotlightNew component
// import { TypewriterEffect } from "@/components/ui/typewriter-effect";

// const Home: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const { isDarkMode } = useTheme();
//   const words = [
//     {
//       text: "Welcome",
//     },
//     {
//       text: "To",
//     },
//     {
//       text: "The",
//     },
//     {
//       text: "Home",
//     },
//     {
//       text: "Page.",
//       className: "text-blue-500 dark:text-blue-500",
//     },
//   ];

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <>
//       <Navbar />
//       <div
//         className={`p-6 md:px-24 lg:px-48 overflow-x-hidden ${
//           isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
//         }`}
//       >
//         <div className="flex flex-col justify-center items-center h-screen">
//           {/* <h1
//             className={`text-5xl lg:text-[70px] text-center font-bold relative w-[max-content] font-mono before:absolute before:inset-0 before:animate-typewriter after:absolute after:inset-0 after:w-[0.125em] after:animate-caret ${
//               isDarkMode
//                 ? "before:bg-gray-900 after:bg-white"
//                 : "before:bg-gray-100 after:bg-gray-900"
//             }`}
//           >
//             WELCOME TO THE HOME PAGE
//           </h1> */}
//           <TypewriterEffect words={words} />
//           <Link
//             href="emotion"
//             className={`mt-8 px-8 py-4 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ${
//               isDarkMode
//                 ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
//                 : "bg-gradient-to-r from-blue-500 via-green-500 to-teal-500"
//             }`}
//           >
//             GET STARTED
//           </Link>
//         </div>
//         <div className="mt-12 w-full overflow-x-hidden">
//           <Spotlight />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;

'use client';

import React, { useEffect, useState } from 'react';
import Loading from '../components/loading';
import Navbar from '../components/navbar';
import { useTheme } from '../context/themeContext';
import Link from 'next/link';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { isDarkMode } = useTheme();

  // Words for the typewriter effect
  const words = [
    { text: 'Discover', className: 'text-purple-400' },
    { text: 'The', className: 'text-pink-400' },
    { text: 'Future', className: 'text-blue-400' },
    { text: 'Of', className: 'text-green-400' },
    { text: 'Trends.', className: 'text-yellow-400' },
  ];

  // Fake trending influencer data
  const trendingInfluencers = [
    {
      rank: 1,
      name: 'NovaSpark',
      platform: 'YouTube',
      followers: '2.1M',
      growth: '+18%',
    },
    {
      rank: 2,
      name: 'SkyDaze',
      platform: 'TikTok',
      followers: '1.8M',
      growth: '+25%',
    },
    {
      rank: 3,
      name: 'CosmicFlow',
      platform: 'Instagram',
      followers: '3.4M',
      growth: '+12%',
    },
    {
      rank: 4,
      name: 'TrendHopper',
      platform: 'Twitter',
      followers: '900K',
      growth: '+30%',
    },
    {
      rank: 5,
      name: 'BuzzMaven',
      platform: 'Twitch',
      followers: '1.2M',
      growth: '+10%',
    },
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Helper to parse growth string like "+25%" -> 25
  const parseGrowth = (growth: string) => {
    const numeric = parseInt(growth.replace(/[^0-9]/g, ''), 10);
    return isNaN(numeric) ? 0 : numeric;
  };

  return (
    <>
      <Navbar />

      {/* Entire Page Container */}
      <div
        className={`relative min-h-screen w-full overflow-hidden ${
          isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'
        }`}
      >
        {/* 🔥 Animated Gradient Background (Teal/Gray) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-800 to-teal-900 opacity-50 blur-3xl animate-pulse" />
        </div>

        {/* ======================
            HERO SECTION
        ====================== */}
        <div className="flex flex-col items-center justify-center pt-12 sm:pt-16 md:pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 sm:px-12 sm:py-16 md:px-16 md:py-24 backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-3xl text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-wide drop-shadow-neon">
              Check Who's Trending on <span className="text-purple-400">ViralWave?</span>
            </h1>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 mt-4 md:mt-6">
              Where Trends Come Alive!
            </h2>

            <p className="mt-4 md:mt-8 text-base sm:text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Dive into the world of trends with ViralWave. Discover what's hot, who's leading,
              and what's next—all in one place.
            </p>

            {/* Typewriter Effect */}
            <div className="mt-6 md:mt-10">
              <TypewriterEffect words={words} />
            </div>

            {/* Glowing CTA Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 md:mt-12"
            >
              <Link
                href="/explore"
                className="inline-block px-6 py-3 sm:px-10 sm:py-4 md:px-14 md:py-5 text-lg sm:text-xl md:text-2xl font-semibold rounded-full shadow-lg bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 text-white hover:shadow-neon transition-transform duration-300"
              >
                JOIN THE TREND
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* BOTTOM DIVIDER */}
        <div className="relative flex items-center justify-center w-full pt-12 pb-8">
          <div className="w-11/12 h-px bg-gradient-to-r from-teal-500 to-indigo-600" />
        </div>

        {/* ======================
            BRAND & INFLUENCER COLLABS
        ====================== */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-24 py-12 md:py-24">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 tracking-wide text-center"
          >
            Brand & Influencer Collabs
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 text-center"
          >
            Let’s make the perfect match: <span className="font-semibold">Brands</span> with big visions 
            and <span className="font-semibold">Influencers</span> who can bring them to life. 
            Watch your collaborations soar beyond expectations!
          </motion.p>

          {/* 2 Boxes side-by-side showing a 'conversation' */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Box #1 - Brand */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-3xl p-6 md:p-8 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                  B
                </div>
                <h3 className="text-xl font-semibold">Brand</h3>
              </div>

              {/* Chat Bubble */}
              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <p className="text-gray-200 mb-2 font-medium text-sm sm:text-base">
                  “We’d love to partner with you to launch our new product line. 
                  Your content style is exactly what we need to go viral!”
                </p>
                <p className="text-gray-500 text-xs">2 mins ago</p>
              </div>

              {/* Footer / Info */}
              <p className="text-gray-300 text-sm sm:text-base">
                Ready to amplify our brand’s reach? Let’s talk details and 
                create something extraordinary.
              </p>
            </motion.div>

            {/* Box #2 - Influencer (capital I) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-3xl p-6 md:p-8 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                  I
                </div>
                <h3 className="text-xl font-semibold">Influencer</h3>
              </div>

              {/* Chat Bubble */}
              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <p className="text-gray-200 mb-2 font-medium text-sm sm:text-base">
                  “That sounds awesome! I’ve got some creative ideas to make 
                  this launch explode on social media. Let’s make it big!”
                </p>
                <p className="text-gray-500 text-xs">1 min ago</p>
              </div>

              {/* Footer / Info */}
              <p className="text-gray-300 text-sm sm:text-base">
                Open to brainstorming sessions, storyboards, and epic 
                collaborations that get everyone talking.
              </p>
            </motion.div>
          </div>
        </div>

        {/* SECOND DIVIDER */}
        <div className="relative flex items-center justify-center w-full pt-12 pb-8">
          <div className="w-11/12 h-px bg-gradient-to-r from-teal-500 to-indigo-600" />
        </div>

        {/* ======================
            WHAT'S TRENDING LEADERBOARD
        ====================== */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-24 pb-24">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 tracking-wide text-center"
          >
            What's Trending?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 text-center"
          >
            Explore our latest <span className="font-semibold">Leaderboard</span> of rising stars 
            across social media. Stay ahead of the curve and see who’s blowing up your feed!
          </motion.p>

          {/* Leaderboard Table */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-3xl p-6"
          >
            <table className="table-auto w-full text-left text-sm sm:text-base text-gray-300">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3">Rank</th>
                  <th className="pb-3">Influencer</th>
                  <th className="pb-3">Platform</th>
                  <th className="pb-3">Followers</th>
                  <th className="pb-3">Growth</th>
                </tr>
              </thead>
              <tbody>
                {trendingInfluencers.map((inf) => {
                  const growthValue = parseGrowth(inf.growth); // numeric
                  return (
                    <tr
                      key={inf.rank}
                      className={`border-b border-white/10 hover:bg-white/5 transition ${
                        inf.rank === 1 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:bg-none' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3 pr-4 font-bold">
                        {inf.rank}
                      </td>
                      {/* Name */}
                      <td className="py-3 pr-4">
                        {inf.name}
                      </td>
                      {/* Platform */}
                      <td className="py-3 pr-4">
                        {inf.platform}
                      </td>
                      {/* Followers */}
                      <td className="py-3 pr-4">
                        {inf.followers}
                      </td>
                      {/* Growth with Progress Bar */}
                      <td className="py-3 pr-4 flex items-center gap-2">
                        <span>{inf.growth}</span>
                        <div className="relative w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-full bg-green-500"
                            style={{ width: `${growthValue}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>

      {/* 🔥 Animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes float-reverse {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(20px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
        .animate-float-reverse {
          animation: float-reverse 6s infinite ease-in-out;
        }
        .drop-shadow-neon {
          text-shadow: 0 0 15px rgba(255, 0, 255, 0.7),
            0 0 25px rgba(255, 0, 255, 0.5);
        }
        .hover\\:shadow-neon:hover {
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.7),
            0 0 25px rgba(255, 0, 255, 0.5);
        }
      `}</style>
    </>
  );
};

export default Home;
