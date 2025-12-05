"use client";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthProviders/AuthProvider";

interface Course {
  _id: string;
  title: string;
  description: string;
  batches: { name: string }[];

  enrollments?: {
    
    studentEmail: string;
    date: string;
  }[];

  assignments?: {
    title: string;
    description: string;
    submittedBy: {
      studentEmail: string;
      fileUrl: string;
      submittedAt: string;
    }[];
  }[];
}

const AdminDashboard: React.FC = () => {
  const { role } = useContext(AuthContext);

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "enrollments" | "assignments">("courses");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin") return;

    const loadCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [role]);

  const fetchEnrollments = (courseId: string) => {
    const course = courses.find((c) => c.title === courseId) || null;
    setSelectedCourse(course);
    setActiveTab("enrollments");
  };

  const fetchAssignments = (courseId: string) => {
    const course = courses.find((c) => c.title === courseId) || null;
    setSelectedCourse(course);
    setActiveTab("assignments");
  };

  if (role !== "admin") return <p className="text-center mt-20 text-red-500 text-xl">⛔ Access Denied</p>;
  if (loading) return <p className="text-center mt-20 text-lg">Loading...</p>;

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="flex gap-4 justify-center mb-8">
        {["courses", "enrollments", "assignments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              activeTab === tab ? "bg-violet-600 shadow-lg" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* COURSES VIEW */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {courses.length === 0 && <p>No Courses Available</p>}
          {courses.map((course) => (
            <div key={course._id} className="bg-gray-900 p-5 rounded-xl shadow-md hover:scale-[1.02] transition">
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-gray-300 text-sm mt-1">{course.description}</p>

              

              <div className="flex gap-3 mt-4">
                <button
                  className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-500"
                  onClick={() => fetchEnrollments(course.title)}
                >
                  Enrollments
                </button>

                <button
                  className="px-3 py-1 bg-green-600 rounded hover:bg-green-500"
                  onClick={() => fetchAssignments(course.title)}
                >
                  Assignments
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ENROLLMENTS VIEW */}
      {activeTab === "enrollments" && selectedCourse && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Enrollments – {selectedCourse.title}</h2>

          {selectedCourse.enrollments?.length ? (
            <table className="w-full bg-gray-900 rounded overflow-hidden">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-2 border-gray-700 border">Name</th>
                  <th className="p-2 border-gray-700 border">Email</th>
                  <th className="p-2 border-gray-700 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse.enrollments.map((e, i) => (
                  <tr key={i} className="text-center">
                   
                    <td className="p-2 border-gray-800 border">{e.studentEmail}</td>
                    <td className="p-2 border-gray-800 border">{new Date(e.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No enrollments found.</p>
          )}
        </div>
      )}

      {/* ASSIGNMENTS VIEW */}
      {activeTab === "assignments" && selectedCourse && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Assignments – {selectedCourse.title}</h2>

          {selectedCourse.assignments?.length ? (
            selectedCourse.assignments.map((a, i) => (
              <div key={i} className="mb-6 bg-gray-900 p-4 rounded-xl shadow">
                <h3 className="text-xl font-bold">{a.title}</h3>
                <p className="text-gray-300 text-sm mb-2">{a.description}</p>

                {a.submittedBy?.length ? (
                  <table className="w-full bg-gray-800 rounded overflow-hidden">
                    <thead>
                      <tr>
                        <th className="p-2 border-gray-700 border">Student</th>
                        <th className="p-2 border-gray-700 border">File</th>
                        <th className="p-2 border-gray-700 border">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.submittedBy.map((s, j) => (
                        <tr key={j} className="text-center">
                          <td className="p-2 border-gray-700 border">{s.studentEmail}</td>
                          <td className="p-2 border-gray-700 border">
                            <a href={s.fileUrl} target="_blank" className="text-blue-400 underline">
                              View File
                            </a>
                          </td>
                          <td className="p-2 border-gray-700 border">
                            {new Date(s.submittedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No submissions yet.</p>
                )}
              </div>
            ))
          ) : (
            <p>No assignments found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
