"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: string;
  tags: string[];
  syllabus: {
    title: string;
    videoUrl: string;
  }[];
}
export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("http://localhost:5000/api/courses"); 
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

 return (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-6 text-violet-400">Available Courses</h1>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses.map(course => (
        <div
          key={course._id}
          className="bg-gray-100 rounded-xl shadow-md border border-gray-200 p-5 transition-transform hover:scale-[1.02] hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>

          <p className="text-gray-600 text-sm mt-2">
            {course.description.slice(0, 80)}...
          </p>

          <p className="mt-3 text-lg font-bold text-indigo-600">${course.price}</p>

          <div className="mt-5">
        <Link
  href={`/details/${encodeURIComponent(course.title)}`}
  className="inline-block w-full text-center bg-violet-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
>
  View Details
</Link>

          </div>
        </div>
      ))}
    </div>
  </div>
);
}
