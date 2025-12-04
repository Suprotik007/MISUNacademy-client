'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthProviders/AuthProvider';
import Link from 'next/link';

interface Enrollment {
  _id: string;
  courseTitle: string;
  paymentDate: string;
  email: string;
}

const StudentDashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authContext?.user?.email) return;

    const fetchEnrollments = async () => {
      try {
        const email = authContext.user?.email;
        if (!email) return;
        const res = await fetch(
          `http://localhost:5000/api/student/enrollments/${encodeURIComponent(
            email
          )}`
        );
        const data: Enrollment[] = await res.json();
        setEnrollments(data);
      } catch (err) {
        console.error("Failed to fetch enrollments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [authContext?.user?.email]);

  if (!authContext || authContext.loading) return <p>Loading...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      {loading ? (
        <p>Loading your enrolled courses...</p>
      ) : enrollments.length === 0 ? (
        <p>You have not enrolled in any courses yet.</p>
      ) : (
        <ul className="space-y-4">
          {enrollments.map(enroll => (
            <li key={enroll._id} className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{enroll.courseTitle}</h2>
              <p className="text-gray-600">
                Enrolled on: {new Date(enroll.paymentDate).toLocaleDateString()}
              </p>
              <Link
                href={`/details/${encodeURIComponent(enroll.courseTitle)}`}
                className="mt-2 inline-block text-indigo-600 hover:underline"
              >
                Go to Course
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentDashboard;
