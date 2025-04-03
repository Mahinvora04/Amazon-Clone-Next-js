'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { ToastContainer } from 'react-toastify';
import * as z from 'zod';

import useStore from '../store';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { loginWithGoogle, loginWithGithub, loginWithFacebook } = useStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Invalid credentials');
      }

      setSuccessMessage('Login successful! Redirecting...');
      setErrorMessage('');
      setLoading(true);
      router.push('/');
    } catch (error) {
      console.error('Login error:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <ToastContainer
        position="top-right"
        autoClose={3000} // Ensure this is set
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        {errorMessage && (
          <p className="bg-red-500 text-white text-center p-2 rounded mb-4">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-1 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full border bg-gray-900 cursor-pointer text-white font-semibold py-2 rounded-md transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Social Login Buttons */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => loginWithGoogle()}
            disabled={loading}
            className="p-3 bg-white text-black rounded-full hover:bg-gray-100 cursor-pointer transition duration-300"
          >
            <FcGoogle className="text-2xl" />
          </button>

          <button
            onClick={() => loginWithGithub()}
            disabled={loading}
            className="p-3 bg-gray-900 text-white rounded-full cursor-pointer transition duration-300"
          >
            <FaGithub className="text-2xl" />
          </button>

          <button
            onClick={() => loginWithFacebook()}
            disabled={loading}
            className="p-3 bg-blue-600 text-white rounded-full cursor-pointer transition duration-300"
          >
            <FaFacebook className="text-2xl" />
          </button>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-400 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
