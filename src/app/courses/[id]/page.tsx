'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AuthContext } from '@/app/AuthProviders/AuthProvider';

interface SyllabusItem {
  title: string;
  videoUrl: string;
  completed?: boolean;
}

interface Course {
  _id: string;
  title: string;
  syllabus: SyllabusItem[];
}

interface Enrollment {
  courseId: string;
  completedLessons: string[];
}

const CoursePage: React.FC = () => {
  const params = useParams();
  const authContext = useContext(AuthContext);
  const courseId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;

  const [course, setCourse] = useState<Course | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authContext?.user) return;

    const fetchCourse = async () => {
      try {
        // Fetch course info
        const courseRes = await fetch(` https://misun-academy-server.vercel.app/api/courses/${courseId}`);
        const courseData: Course = await courseRes.json();
        setCourse(courseData);

        // Fetch enrollment for this student
        const enrollRes = await fetch(
          ` https://misun-academy-server.vercel.app/api/student/enrollment/${encodeURIComponent(user.email)}/${courseId}`
        );
        const enrollmentData: Enrollment = await enrollRes.json();
        setCompletedLessons(enrollmentData?.completedLessons || []);

      } catch (err) {
        console.error('Failed to fetch course or enrollment', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [authContext, courseId]);

  const handleMarkCompleted = async (lessonTitle: string) => {
    if (!authContext?.user || !course) return;

    try {
      
      await fetch(' https://misun-academy-server.vercel.app/api/student/complete-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: authContext.user.email,
          courseId: course._id,
          lessonTitle,
        }),
      });

      // Update local state
      setCompletedLessons((prev) => [...prev, lessonTitle]);
    } catch (err) {
      console.error('Failed to mark lesson completed', err);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!course) return <p className="text-center mt-20 text-red-500">Course not found.</p>;

  const progress = Math.round((completedLessons.length / course.syllabus.length) * 100);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

      <div className="mb-6">
        <p className="font-semibold">Progress: {progress}%</p>
        <div className="w-full h-4 bg-gray-200 rounded-full mt-1">
          <div
            className="h-4 bg-green-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {course.syllabus.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.title);
          return (
            <div key={lesson.title} className="bg-white rounded-xl shadow p-4">
              <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
              <iframe
                src={lesson.videoUrl}
                title={lesson.title}
                width="100%"
                height="220"
                className="rounded-lg border"
                allowFullScreen
              />
              <button
                onClick={() => handleMarkCompleted(lesson.title)}
                disabled={isCompleted}
                className={`mt-3 py-2 px-4 rounded-lg font-semibold text-white transition ${
                  isCompleted ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isCompleted ? 'Completed' : 'Mark as Completed'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursePage;
