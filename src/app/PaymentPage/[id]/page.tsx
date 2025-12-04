'use client';

import React, { useContext, useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthContext } from '@/app/AuthProviders/AuthProvider';


interface Course {
  id: string;
  title: string;
  price: number;
}

const PaymentPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;

  const [course, setCourse] = useState<Course | null>(null);
  const [pgNumber, setPgNumber] = useState('');
  const [amount, setAmount] = useState('');


  useEffect(() => {
    if (!authContext) return;

    if (!authContext.loading && !authContext.user) {
      router.push('/Login'); 
    }
}, [authContext, router]);

useEffect(() => {
  if (!id) return;

  const fetchCourse = async () => {
    try {
 
      const res = await fetch(`http://localhost:5000/api/courses/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('Course not found');
      const data: Course = await res.json();
      setCourse(data);
      setAmount(data.price.toString());
    } catch (err) {
      console.error('Failed to fetch course:', err);
      setCourse(null);
    }
  };

  fetchCourse();
}, [id]);


const handlePayment = async (e: FormEvent) => {
  e.preventDefault();

  if (!pgNumber || !authContext?.user?.email || !course) {
    alert("Missing required details");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/student/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: pgNumber,
        userEmail: authContext.user.email,
        courseTitle: course.title
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Payment recorded & enrolled successfully!");
      router.push("/studentDashboard"); 
    } else {
      alert(data.error || "Failed");
    }

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


  if (!authContext || authContext.loading) {
    return <p className="text-center mt-20">Checking authentication...</p>;
  }

  if (!course) return <p className="text-center mt-20 text-red-500">Course not found.</p>;

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Enroll in {course.title}
        </h1>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Ph Number
            </label>
            <input
              type="text"
              value={pgNumber}
              onChange={(e) => setPgNumber(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter Ph number"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter amount"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
          >
            Pay
          </button>
        </form> 
      </div>
    </div>
  );
};

export default PaymentPage;
