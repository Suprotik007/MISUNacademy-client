'use client';

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthProviders/AuthProvider";

interface Props {
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  onClose: () => void;
}

const AssignmentForm = ({ courseId, courseTitle, lessonId, lessonTitle, onClose }: Props) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) setError("User not logged in. Cannot submit assignment.");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return setError("Paste your assignment link first.");
    if (!user?.email || !user?.displayName) return setError("User info missing.");

    setLoading(true);
    setError("");

    const payload = {
      courseId,
      courseTitle,
      lessonId,
      lessonTitle,
      link,
      userEmail: user.email,
      userName: user.displayName,
    };

    console.log("Submitting assignment:", payload);

    try {
      const res = await fetch(" https://misun-academy-server.vercel.app/api/assignments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to submit assignment");

      alert("Assignment submitted 🎉");
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-gray-700 rounded-md bg-gray-200 border-2 shadow-md max-w-sm w-full mx-auto relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 font-bold hover:text-gray-800"
      >
        ✕
      </button>

      <form onSubmit={handleSubmit} className="lg:flex lg:gap-3 space-y-2 lg:space-y-0">
        <input
          type="url"
          placeholder="Paste Assignment Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border-2 p-2 w-full rounded lg:flex-1"
          required
        />
        <button
          disabled={loading}
          className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition w-full lg:w-auto"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div> 
  );
};

export default AssignmentForm;
