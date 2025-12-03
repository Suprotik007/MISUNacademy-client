'use client';

import React, { useContext, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../AuthProviders/AuthProvider';
import { auth } from '../../../Firebase';

const RegBox: React.FC = () => {
  const { createUser, setUser, updateUser } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      photo: { value: string };
      email: { value: string };
      password: { value: string };
    };

    const name = target.name.value;
    const photo = target.photo.value;
    const email = target.email.value;
    const password = target.password.value;

    try {
      const result = await createUser(email, password);
      const user = result.user;

      // Update profile
      await updateUser({
        displayName: name,
        photoURL: photo || null,
      });

      const updatedUser = auth.currentUser;

      if (!updatedUser) throw new Error('User not found after registration');

      // Save user to your backend
      const userInfo = {
        name: updatedUser.displayName,
        email,
        photoURL: updatedUser.photoURL,
        role: 'student',
      };

      const res = await fetch('https://a12-server-gamma.vercel.app/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });

      if (!res.ok) throw new Error('Failed to save user data');

      toast.success('Registration successful!');
      setUser(updatedUser);
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Registration failed');
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-gray-950 text-white px-4">

    <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-700 shadow-[0_0_20px_#00ffd5] rounded-2xl p-10 w-full max-w-md">

      <h1 className="text-3xl font-extrabold text-center mb-8 text-teal-300 drop-shadow-[0_0_8px_#00ffd5]">
        Create an Account
      </h1>

      <form onSubmit={handleRegister} className="space-y-5">

        <div>
          <label className="text-sm font-semibold text-teal-300">Full Name</label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 w-full p-3 rounded-md bg-black/40 border border-gray-600 focus:outline-none focus:border-teal-400 text-white placeholder-gray-400"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-teal-300">Photo URL</label>
          <input
            type="text"
            name="photo"
            required
            className="mt-1 w-full p-3 rounded-md bg-black/40 border border-gray-600 focus:outline-none focus:border-teal-400 text-white placeholder-gray-400"
            placeholder="Profile picture link"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-teal-300">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full p-3 rounded-md bg-black/40 border border-gray-600 focus:outline-none focus:border-teal-400 text-white placeholder-gray-400"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-teal-300">Password</label>
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full p-3 rounded-md bg-black/40 border border-gray-600 focus:outline-none focus:border-teal-400 text-white placeholder-gray-400"
            placeholder="Create password"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-bold bg-teal-500/90 hover:bg-teal-400 transition-all shadow-[0_0_12px_#00ffd5] active:scale-95"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link href="/Login" className="text-teal-300 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>

      <ToastContainer theme="dark" autoClose={3000} />
    </div>
  </div>
);

};

export default RegBox;
