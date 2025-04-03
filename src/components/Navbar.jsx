'use client';

import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import useStore from '../app/store';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryOffcanvasOpen, setIsCategoryOffcanvasOpen] = useState(false);
  const router = useRouter();
  const {
    logoutUser,
    categories,
    fetchCategories,
    fetchedUser,
    fetchUserProfile,
  } = useStore();

  useEffect(() => {
    const token = Cookies.get('authToken');
    setIsLoggedIn(!!token);
    fetchCategories();
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  const closeDropdown = () => setIsProfileOpen(false);

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-gray-900 text-white px-6 py-4 shadow-md w-full">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <img
              src="../../logo/amazon_logo.png"
              alt="amazon logo"
              className="w-24 h-auto"
            />
          </Link>
          <div className="flex space-x-6 items-center">
            {isLoggedIn && (
              <>
                <Link href="/cart" className="hover:text-gray-300 transition">
                  Cart
                </Link>

                <Link
                  href="/wishlist"
                  className="hover:text-gray-300 transition"
                >
                  {fetchedUser?.name?.split(' ')[0]} 's Wishlist
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="hover:text-gray-300 transition hover:cursor-pointer"
                >
                  Profile ▼
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded-lg shadow-lg z-10">
                    <Link
                      onClick={closeDropdown}
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeDropdown();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-300 transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hover:text-gray-300 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Second Navbar for Categories */}
      <nav className="bg-gray-800 text-white px-6 shadow-sm">
        <div className="container mx-auto flex justify-between">
          <button
            className="lg:hidden text-white text-2xl hover:cursor-pointer"
            onClick={() => setIsCategoryOffcanvasOpen(true)}
          >
            ☰
          </button>
          <Link
            href={`/products`}
            className="hover:text-gray-300 transition px-1 py-3 border border-transparent hover:border-white"
          >
            All products
          </Link>
          <div className="hidden lg:flex overflow-x-auto space-x-6 ">
            {categories.map((category) => (
              <Link
                key={category.category_id}
                href={`/products/${category.category_id}`}
                className="hover:text-gray-300 transition border py-3 px-1 border-transparent hover:border-white"
              >
                {category.category_type}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Offcanvas Menu for Categories */}
      {isCategoryOffcanvasOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="w-64 h-full bg-gray-800 text-white shadow-lg p-6 flex flex-col">
            <button
              className="text-white text-2xl self-end"
              onClick={() => setIsCategoryOffcanvasOpen(false)}
            >
              ×
            </button>
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.category_id}
                  href={`/products/${category.category_id}`}
                  className="mt-4 hover:text-gray-300 transition "
                  onClick={() => setIsCategoryOffcanvasOpen(false)}
                >
                  {category.category_type}
                </Link>
              ))
            ) : (
              <span className="text-gray-400">Loading categories...</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
