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


  const createUser = async (email: string, password: string, name: string, photo?: string) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = res.user;

    await updateProfile(firebaseUser, { displayName: name, photoURL: photo || "" });

    await fetch("http://localhost:5000/api/users/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: firebaseUser.uid,
        name,
        email,
        photo: photo || "",
        role: "student",
      }),
    });

    setUser(firebaseUser);
    setRole("student");

    setLoading(false);
    return firebaseUser;
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const res = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = res.user;

    // Fetch role from backend
    const roleRes = await fetch(`http://localhost:5000/api/users/${firebaseUser.uid}`);
    const data = await roleRes.json();
    setRole(data.role || "student");

    setUser(firebaseUser);
    setLoading(false);
    return firebaseUser;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const res = await fetch(`http://localhost:5000/api/users/${currentUser.uid}`);
          const data = await res.json();
          setRole(data.role || "student");
        } catch {
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
