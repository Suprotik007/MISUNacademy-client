'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import {  FiHome, FiBox,  FiX } from 'react-icons/fi';

import { useSession } from 'next-auth/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();

  const links = (
    <nav className="flex flex-col pl-5 gap-4 font-semibold text-gray-700 dark:text-gray-300">
     
      <Link
        href="/products"
        className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-violet-600 hover:text-white transition"
      >
        <FiBox size={20} />
        <span>View Courses</span>
      </Link>
      <Link
        href="/"
        className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-violet-600 hover:text-white transition"
      >
        <FiHome size={20} />
        <span>Home</span>
      </Link>
    </nav>
  );

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-100 dark:bg-gray-900 rounded-r-2xl shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Close Button */}
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full mt-4 ml-auto mr-4 text-gray-600 dark:text-gray-300 hover:bg-violet-600 hover:text-white transition"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <FiX size={24} />
      </button>

      {/* Profile Section */}
      <div className="flex flex-col items-center p-6 space-y-3 border-b border-gray-300 dark:border-gray-700">
       
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {session?.user?.name ?? 'Guest'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {session ? 'Premium Member' : 'Sign in to get benefits'}
        </p>
      </div>

      {/* Navigation Links */}
      <div className="p-6">{links}</div>

      {/* Logout / Login */}
      <div className="mt-auto p-6 border-t border-gray-300 dark:border-gray-700">
        <p>login</p>
      </div>
    </div>
  );
};

export default Sidebar;
