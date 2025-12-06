'use client';

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/AuthProviders/AuthProvider";
import LessonItem from "../Elements/LessonItem"

interface Progress {
  lessonTitle: string;
  completed: boolean;
}

interface Enrollment {
  _id: string;
  courseTitle: string;
  courseId: string;
  progress: Progress[];
  paymentDate: string;
}

const StudentDashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authContext?.user?.email) return;

    const fetchEnrollments = async () => {
      try {
        const res = await fetch(
          ` https://misun-academy-server.vercel.app/api/student/enrollments/${encodeURIComponent(authContext.user.email)}`
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

  const markLessonCompleted = async (enrollId: string, lessonTitle: string) => {
    try {
      const res = await fetch(
        ` https://misun-academy-server.vercel.app/api/student/enrollments/${enrollId}/complete`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonTitle }),
        }
      );
      const updated = await res.json();
      if (res.ok) {
        setEnrollments(prev =>
          prev.map(e => (e._id === enrollId ? updated.enrollment : e))
        );
      }
    } catch (err) {
      console.error("Failed to mark lesson:", err);
    }
  };

  if (!authContext || authContext.loading || loading) {
    return <p className="text-center mt-20">Loading your courses...</p>;
  }

  if (!enrollments.length) {
    return <p className="text-center mt-20">You have no enrolled courses yet.</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {enrollments.map(enroll => {
        const totalLessons = enroll.progress.length || 1;
        const completedLessons = enroll.progress.filter(l => l.completed).length;
        const progressPercent = Math.round((completedLessons / totalLessons) * 100);

        return (
          <div key={enroll._id} className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">{enroll.courseTitle}</h2>
            <p className="text-gray-500 mb-2">
              Payment Date: {new Date(enroll.paymentDate).toLocaleDateString()}
            </p>

            <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full mb-4">
              <div
                className="bg-indigo-600 h-4 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="mb-2">{progressPercent}% Completed</p>

            <div>
              <h3 className="font-semibold mb-1">Lessons</h3>
              {enroll.progress.map(lesson => (
                <LessonItem
                  key={lesson.lessonTitle}
                  lesson={lesson}
                  enrollId={enroll._id}
                  courseId={enroll._id}
                  courseTitle={enroll.courseTitle}
                  lessonId={lesson.lessonTitle}
                  markCompleted={markLessonCompleted}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentDashboard;
