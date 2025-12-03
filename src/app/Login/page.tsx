'use client';

import React, { useState, useContext, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../AuthProviders/AuthProvider';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../Firebase';

const LoginBox: React.FC = () => {
  const { signIn } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Google login successful');
      router.push(redirectUrl);
    } catch {
      toast.error('Google login failed');
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      toast.success('Logged in successfully');
      router.push(redirectUrl);
    } catch {
      toast.error('Either Email or Password is wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-gray-950 text-white px-4">
      
      <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-700 shadow-[0_0_20px_#00ffd5] rounded-2xl p-10 w-full max-w-md">
        
        <h1 className="text-3xl font-extrabold text-center mb-8 text-teal-300 drop-shadow-[0_0_8px_#00ffd5]">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="text-sm font-semibold text-teal-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 rounded-md bg-black/40 border border-gray-600 focus:outline-none focus:border-teal-400 text-white placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-teal-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 rounded-md bg-black/40 border border-gray-600 focus:outline-none focus:border-teal-400 text-white placeholder-gray-400"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold bg-teal-500/90 hover:bg-teal-400 transition-all shadow-[0_0_12px_#00ffd5] active:scale-95"
          >
            Login
          </button>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 border border-teal-400 hover:bg-teal-400/20 transition-all"
          >
       
            Login with Google
          </button>

          <p className="text-center text-sm text-gray-300">
            Don't have an account?{' '}
            <Link href="/Register" className="text-teal-300 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </form>

        <ToastContainer theme="dark" autoClose={3000} />
      </div>
    </div>
  );
};

export default LoginBox;
