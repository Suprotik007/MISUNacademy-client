'use client';

import React, { createContext, ReactNode, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  User
} from "firebase/auth";
import { app } from "../../../Firebase";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  createUser: (email: string, password: string, name: string, photo?: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  updateUser: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
const auth = getAuth(app);

interface Props { children: ReactNode }

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Create user and store in MongoDB
  const createUser = async (email: string, password: string, name: string, photo?: string) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = res.user;

      // Update displayName and photo
      await updateProfile(firebaseUser, { displayName: name, photoURL: photo || "" });

      // Save user to backend, check if already exists
      await fetch("http://localhost:5000/api/users/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          photo: photo || "",
          role: "student", // default role
        }),
      });

      // Set user state
      setUser(firebaseUser);

      // Fetch role from backend
      const roleRes = await fetch(`http://localhost:5000/api/users/${encodeURIComponent(email)}`);
      const data = await roleRes.json();
      setRole(data.role || "student");

      return firebaseUser;
    } finally {
      setLoading(false);
    }
  };

  // Login and fetch role from backend
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = res.user;

      // Fetch role
      const roleRes = await fetch(`http://localhost:5000/api/users/${encodeURIComponent(email)}`);
      const data = await roleRes.json();
      setRole(data.role || "student");

      setUser(firebaseUser);
      return firebaseUser;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) return;
    return updateProfile(auth.currentUser, data);
  };

  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setRole(null);
    setLoading(false);
  };

  // Track auth state and fetch role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        try {
          const res = await fetch(`http://localhost:5000/api/users/${encodeURIComponent(currentUser.email)}`);
          const data = await res.json();
          setRole(data.role || "student");
        } catch (err) {
          console.error("Failed to fetch user role:", err);
          setRole("student");
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, createUser, signIn, updateUser, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
