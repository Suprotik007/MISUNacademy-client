'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';


interface SyllabusItem {
  title: string;
  videoUrl: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: string;
  tags: string[];
  syllabus: SyllabusItem[];
}

const CourseDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
 

  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const res = await fetch('/data/courses.json'); 
        const data: Course[] = await res.json();

        const foundCourse = data.find(c => c.id === id) || null;
        setCourse(foundCourse);
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading course...</p>;
  if (!course) return <p className="text-center mt-20 text-red-500">Course not found.</p>;

  const handleEnroll = () => {
    if (id) {
      router.push(`/PaymentPage/${course.id}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-10">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-300">{course.title}</h1>
        <p className="text-gray-700 dark:text-gray-5 00 text-lg">{course.description}</p>

        {/* Syllabus */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Syllabus</h2>
          <ul className="space-y-4">
            {course.syllabus.map((item, index) => (
              <li
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition p-4"
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{item.title}</h3>
                <iframe
                  src={item.videoUrl}
                  title={item.title}
                  width="100%"
                  height="220"
                  className="mt-3 rounded-lg border"
                  allowFullScreen
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sidebar / Enrollment */}
      <div className="lg:col-span-1 sticky top-20 space-y-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 font-semibold">Instructor</p>
          <p className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">{course.instructor}</p>

          <p className="text-gray-600 dark:text-gray-400 font-semibold">Price</p>
          <p className="text-gray-900 dark:text-gray-100 text-2xl font-bold mb-6">${course.price}</p>

          <button
            onClick={handleEnroll}
            className="w-full bg-violet-600 hover:bg-indigo-700 transition-colors text-white font-semibold py-3 rounded-lg text-lg"
          >
            Enroll Now
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300">
          <p className="font-semibold mb-2">Category:</p>
          <p>{course.category}</p>

          <p className="font-semibold mt-4 mb-2">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {course.tags.map(tag => (
              <span
                key={tag}
                className="bg-violet-100 dark:bg-violet-700 text-violet-800 dark:text-violet-200 px-3 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
