'use client';

import React, { useState, FC, useContext } from 'react';
import Link from 'next/link';
import Sidebar from '../Elements/Sidebar';
import { AuthContext } from '../AuthProviders/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar: FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  
  const context = useContext(AuthContext);
  const role = context?.role;
  if (!context) return null;

  const { user, logOut } = context;

  const links = (
    <div className="flex space-x-8 font-semibold text-gray-700 dark:text-gray-300 items-center">
      <Link
        href="/"
        className="hover:text-violet-600 dark:hover:text-violet-400 transition"
      >
        Courses
      </Link>

      <Link
        href={role === "admin" ? "/adminDashboard" : "/studentDashboard"}
        className="hover:text-violet-600 dark:hover:text-violet-400 transition"
      >
        Dashboard
      </Link>
    </div>
  );

  const handleLogOut = async () => {
    try {
      await logOut();
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout failed', err);
      toast.error('Logout failed');
    }
  };

  return (
    <>
      <header className="p-6 rounded-b-2xl dark:bg-gray-900 dark:text-gray-100 shadow-md sticky top-0 z-50 bg-white">
        <div className="container flex justify-between items-center mx-auto max-w-7xl">
          <Link href="/" className="flex items-center space-x-2">
            <p className="text-3xl font-mono font-extrabold text-violet-600 dark:text-violet-400">
              CourseMaster
            </p>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex">{links}</nav>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <button
                onClick={handleLogOut}
                className="px-4 py-2 text-red-500 rounded-full border border-red-500 font-semibold  hover:bg-red-50 dark:hover:bg-red-800 transition hover:text-white "
              >
                Log Out
              </button>
            ) : (
              <Link href="/Login">
                <button className="px-4 py-2 rounded-full border border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white transition">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="p-2 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-violet-600"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-7 h-7 dark:text-violet-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Navbar;
