import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/admin/dashboard'); // Redirect to admin dashboard if already logged in
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://chat-game-ten.vercel.app/api/auth/login-admin', {
        email,
        password,
      });

      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminName', response.data.name);
      
      // Remove regular user token if exists
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
      }
      
      router.push('/admin/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Login failed');
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
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Admin Login</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full text-black bg-white px-4 py-3 border border-gray-900 rounded-md focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full text-black bg-white px-4 py-3 border border-gray-900 rounded-md focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-6 space-y-2">
            <p className="text-sm text-center text-gray-700">
              Don&apos;t have an admin account?{' '}
              <Link href="/auth/admin/register" className="text-indigo-600 hover:underline">
                Register
              </Link>
            </p>
            <p className="text-sm text-center text-gray-700">
              Not an admin?{' '}
              <Link href="/auth/login" className="text-indigo-600 hover:underline">
                Login as User
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
