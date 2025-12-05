"use client";

import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthProviders/AuthProvider";

interface Batch {
  _id?: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: string;
  tags: string[];
  syllabus: string[]; // YouTube links
  batches?: Batch[];
}

interface Enrollment {
  _id: string;
  userEmail: string;
  phone: string;
  courseTitle: string;
}

interface Assignment {
  _id: string;
  lessonId: string;
  link: string;
  userEmail: string;
  userName: string;
  submittedAt: string;
}

const AdminDashboard: React.FC = () => {
  const { role } = useContext(AuthContext);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollmentsByCourse, setEnrollmentsByCourse] = useState<Record<string, Enrollment[]>>({});
  const [assignmentsByCourse, setAssignmentsByCourse] = useState<Record<string, Assignment[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"courses" | "enrollments" | "assignments" | "addClass">("courses");

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: "",
    description: "",
    instructor: "",
    price: 0,
    category: "",
    tags: [],
    syllabus: [],
  });

  useEffect(() => {
    if (role !== "admin") return;

    const loadCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [role]);

  // Fetch enrollments dynamically for a course
  const fetchEnrollments = async (courseTitle: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/student/enrollments/${encodeURIComponent(courseTitle)}`);
      const data: Enrollment[] = await res.json();
      setEnrollmentsByCourse(prev => ({ ...prev, [courseTitle]: data }));
      setActiveSection("enrollments");
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
    }
  };

  // Fetch assignments dynamically for a course
  const fetchAssignments = async (courseId: string, courseTitle: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/assignments/course/${courseId}`);
      const data: Assignment[] = await res.json();
      // Store by course title so the UI can display properly
      setAssignmentsByCourse(prev => ({ ...prev, [courseTitle]: data }));
      setActiveSection("assignments");
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    }
  };

  // Handle adding a new course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });
      const data = await res.json();
      setCourses(prev => [...prev, data]);
      setNewCourse({ title: "", description: "", instructor: "", price: 0, category: "", tags: [], syllabus: [] });
      alert("Course added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add course");
    }
  };

  if (role !== "admin") return <p className="text-center mt-20 text-red-500 text-xl">⛔ Access Denied</p>;
  if (loading) return <p className="text-center mt-20 text-lg">Loading...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex gap-4 justify-center mb-8">
        {["courses", "enrollments", "assignments", "addClass"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab as any)}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              activeSection === tab ? "bg-violet-600 shadow-lg" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Courses */}
      {activeSection === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {courses.map(course => (
            <div key={course._id} className="bg-gray-900 p-5 rounded-xl shadow-md hover:scale-[1.02] transition">
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-gray-300 text-sm mt-1">{course.description}</p>

              <div className="flex gap-3 mt-4">
                <button
                  className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-500"
                  onClick={() => fetchEnrollments(course.title)}
                >
                  View Enrollments
                </button>
                <button
                  className="px-3 py-1 bg-green-600 rounded hover:bg-green-500"
                  onClick={() => fetchAssignments(course._id, course.title)}
                >
                  View Assignments
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enrollments */}
      {activeSection === "enrollments" &&
        Object.entries(enrollmentsByCourse).map(([title, list]) => (
          <div key={title} className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">{title} Enrollments</h2>
            {list.length === 0 ? (
              <p>No enrollments found.</p>
            ) : (
              <ul className="text-gray-300">
                {list.map(e => (
                  <li key={e._id}>{e.userEmail} — {e.phone}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

      {/* Assignments */}
      {activeSection === "assignments" &&
        Object.entries(assignmentsByCourse).map(([title, list]) => (
          <div key={title} className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">{title} Assignments</h2>
            {list.length === 0 ? (
              <p>No assignments found.</p>
            ) : (
              <ul className="text-gray-300">
                {list.map(a => (
                  <li key={a._id}>
                    {a.lessonId} — {a.userName} —{" "}
                    <a href={a.link} target="_blank" className="text-blue-400 underline">View</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

      {/* Add Class */}
      {activeSection === "addClass" && (
        <div className="bg-gray-900 p-6 rounded-xl shadow-md max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Add New Class</h2>
          <form className="flex flex-col gap-3" onSubmit={handleAddCourse}>
            <input
              type="text"
              placeholder="Title"
              className="p-2 rounded bg-gray-800"
              value={newCourse.title || ""}
              onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              className="p-2 rounded bg-gray-800"
              value={newCourse.description || ""}
              onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Instructor"
              className="p-2 rounded bg-gray-800"
              value={newCourse.instructor || ""}
              onChange={e => setNewCourse({ ...newCourse, instructor: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              className="p-2 rounded bg-gray-800"
              value={newCourse.price || 0}
              onChange={e => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
              required
            />
            <input
              type="text"
              placeholder="Category"
              className="p-2 rounded bg-gray-800"
              value={newCourse.category || ""}
              onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              className="p-2 rounded bg-gray-800"
              value={newCourse.tags?.join(",") || ""}
              onChange={e => setNewCourse({ ...newCourse, tags: e.target.value.split(",") })}
            />
            <input
              type="text"
              placeholder="Syllabus video link (YouTube)"
              className="p-2 rounded bg-gray-800"
              onChange={e => setNewCourse({ ...newCourse, syllabus: [e.target.value] })}
            />
            <button type="submit" className="bg-violet-600 px-4 py-2 rounded mt-2 hover:bg-violet-500">
              Add Class
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
