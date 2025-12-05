'use client';
import React, { FormEvent, useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../AuthProviders/AuthProvider";

const RegBox: React.FC = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!authContext) return null;

  const { createUser } = authContext;

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
      setLoading(true);
      await createUser(email, password, name, photo);
      toast.success("Registration successful!");
      router.push("/"); 
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-700 shadow rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-teal-300">
          Create an Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-5">
          <input type="text" name="name" placeholder="Full Name" required className="w-full p-3 rounded-md bg-black/40 border border-gray-600" />
          <input type="text" name="photo" placeholder="Photo URL" required className="w-full p-3 rounded-md bg-black/40 border border-gray-600" />
          <input type="email" name="email" placeholder="Email" required className="w-full p-3 rounded-md bg-black/40 border border-gray-600" />
          <input type="password" name="password" placeholder="Password" required className="w-full p-3 rounded-md bg-black/40 border border-gray-600" />

          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold bg-teal-500 hover:bg-teal-400">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-3">
          Already have an account? <Link href="/Login" className="text-teal-300 hover:underline">Login</Link>
        </p>

        <ToastContainer theme="dark" autoClose={3000} />
      </div>
    </div>
  );
};

export default RegBox;
