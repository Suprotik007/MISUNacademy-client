"use client";

import { useEffect, useState } from "react";
import api from "../lib/Axios";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.get("/courses")
      .then(res => setCourses(res.data.courses))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Available Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map(course => (
          <div key={course._id} className="border p-4 rounded">
            <h2 className="font-semibold">{course.title}</h2>
            <p className="text-sm mt-1">{course.description.slice(0, 80)}...</p>
            <p className="mt-2 font-bold">${course.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
