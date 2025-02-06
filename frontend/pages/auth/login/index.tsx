import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login: React.FC = () => {
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('https://chat-game-ten.vercel.app/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      console.log(res.data);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black to-gray-900">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="w-full text-black bg-white px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                className="w-full text-black bg-white px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-sm text-center mt-4 text-gray-600">
            Don’t have an account?{' '}
            <Link href="/auth/register" className="text-indigo-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
