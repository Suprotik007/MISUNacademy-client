'use client';

import React, { useState } from "react";

interface AssignmentFormProps {
  lessonTitle: string;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ lessonTitle }) => {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    // Here you can integrate backend submission if needed
    console.log(`Assignment submitted for ${lessonTitle}:`, answer);
    setSubmitted(true);
  };

  if (submitted) {
    return <p className="text-green-500 mt-2">Assignment submitted successfully!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
      <label className="text-sm font-medium">Submit Assignment for "{lessonTitle}"</label>
      <input
        type="text"
        placeholder="Paste Google Drive link or write your answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="border rounded p-2 text-sm"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
      >
        Submit
      </button>
    </form>
  );
};

export default AssignmentForm;
