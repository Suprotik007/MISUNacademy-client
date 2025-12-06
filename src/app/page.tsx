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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(" https://misun-academy-server.vercel.app/api/courses");
        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("API Response:", data); // Debug log
        
        // Handle different response formats
        let coursesArray: Course[] = [];
        
        if (Array.isArray(data)) {
          // If API returns array directly
          coursesArray = data;
        } else if (data && typeof data === 'object') {
          // If API returns { courses: [...] } or { data: [...] }
          if (Array.isArray(data.courses)) {
            coursesArray = data.courses;
          } else if (Array.isArray(data.data)) {
            coursesArray = data.data;
          } else if (Array.isArray(data.items)) {
            coursesArray = data.items;
          }
        }
        
        console.log("Parsed courses:", coursesArray); // Debug log
        setCourses(coursesArray);
        
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err instanceof Error ? err.message : "Failed to load courses");
        setCourses([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-xl mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl text-gray-500">No courses available</div>
      </div>
    );
  }

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
              {course.description?.slice(0, 80)}...
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