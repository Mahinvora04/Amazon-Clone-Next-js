'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import 'flatpickr/dist/flatpickr.min.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { ToastContainer } from 'react-toastify';
import * as z from 'zod';

import useStore from '../store/index';

const schema = z.object({
  full_name: z.string().min(1, { message: 'Full Name is required' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
  contact: z
    .string()
    .min(10, { message: 'Contact number must be at least 10 digits' })
    .max(15, { message: 'Contact number is too long' }),
  address: z.string().min(1, { message: 'Address is required' }),
});

export default function Register() {
  const { message, registerUser } = useStore();
  const router = useRouter();
  const { loginWithGoogle, loginWithGithub, loginWithFacebook } = useStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      contact: '',
      address: '',
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await registerUser(formData);
      if (response.success) {
        router.push('/');
      } else {
        console.error('Registration failed:', response.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-3">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create an Account
        </h2>

        {message && (
          <p className="text-center text-sm font-medium text-red-400 mb-4">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('full_name')}
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          {errors.full_name && (
            <p className="text-red-400 text-sm">{errors.full_name.message}</p>
          )}

          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email.message}</p>
          )}

          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password.message}</p>
          )}

          <input
            {...register('contact')}
            type="text"
            placeholder="Contact Number"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          {errors.contact && (
            <p className="text-red-400 text-sm">{errors.contact.message}</p>
          )}

          <input
            {...register('address')}
            type="text"
            placeholder="Address"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          {errors.address && (
            <p className="text-red-400 text-sm">{errors.address.message}</p>
          )}

          <button
            type="submit"
            className="w-full border bg-gray-900 cursor-pointer text-white font-semibold py-2 rounded-md transition"
          >
            Register
          </button>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              className="p-3 bg-white text-black rounded-full hover:bg-gray-100 cursor-pointer transition duration-300"
            >
              <FcGoogle className="text-2xl" />
            </button>

            <button
              type="button"
              onClick={() => loginWithGithub()}
              className="p-3 bg-gray-900 text-white rounded-full cursor-pointer transition duration-300"
            >
              <FaGithub className="text-2xl" />
            </button>

            <button
              type="button"
              onClick={() => loginWithFacebook()}
              className="p-3 bg-blue-600 text-white rounded-full cursor-pointer transition duration-300"
            >
              <FaFacebook className="text-2xl" />
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
