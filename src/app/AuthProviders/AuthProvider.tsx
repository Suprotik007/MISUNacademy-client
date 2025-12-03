'use client'
import React, { useEffect, useState, createContext, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import axios from "axios";
import { app } from "../../../Firebase";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createUser: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  updateUser: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const auth = getAuth(app);

interface BackendUser {
  name?: string;
  email?: string;
  photoURL?: string | null;
  role?: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


  const createUser = (email: string, password: string) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email: string, password: string) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (updatedData: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) return Promise.resolve();
    return updateProfile(auth.currentUser, updatedData);
  };

  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser?.email) {
        try {
          // Fetch Firebase ID token
          const idToken = await currentUser.getIdToken();

          // Get backend JWT
          const jwtResponse = await axios.post(`${API_BASE}/auth`, {
            idToken,
          });

          const token: string = jwtResponse.data.token;
          localStorage.setItem("access-token", token);

          // Fetch existing user record
          const userRes = await axios.get<BackendUser>(
            `${API_BASE}/users/${encodeURIComponent(currentUser.email)}`
          );

          const backendUser = userRes.data;

          // Auto-create user in DB if missing or incomplete
          if (!backendUser || !backendUser.name) {
            const newUser = {
              name: currentUser.displayName || backendUser?.name || "New User",
              email: currentUser.email,
              photoURL: currentUser.photoURL || backendUser?.photoURL || null,
              role: backendUser?.role || "student",
            };

            await axios.post(`${API_BASE}/users`, newUser);
            setRole(newUser.role);
          } else {
            setRole(backendUser.role || "student");
          }
        } catch (err) {
          console.error("User sync error:", err);
        }
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const authData: AuthContextType = {
    user,
    setUser,
    role,
    setRole,
    loading,
    setLoading,
    createUser,
    signIn,
    updateUser,
    logOut,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
