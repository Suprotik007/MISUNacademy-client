'use client';
import React, { useState } from "react";
interface QuizModalProps {
  lessonTitle: string;
  onClose: () => void;
}
interface Question {
  question: string;
  options: string[];
  answer: string;
}

const sampleQuiz: Question[] = [
  { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
  { question: "Capital of France?", options: ["Paris", "Berlin", "Rome", "Madrid"], answer: "Paris" },
];

const QuizModal: React.FC<QuizModalProps> = ({ lessonTitle, onClose }) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (qIndex: number, option: string) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => {
    let count = 0;
    sampleQuiz.forEach((q, idx) => {
      if (answers[idx] === q.answer) count++;
    });
    setScore(count);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-lg w-full relative">

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Quiz: {lessonTitle}</h2>

        {score === null ? (
          <div className="flex flex-col gap-4">
            {sampleQuiz.map((q, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <p className="font-medium">{q.question}</p>

                {q.options.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(idx, opt)}
                    className={`px-3 py-1 border rounded text-left transition 
                      ${answers[idx] === opt ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700 w-full mt-3"
            >
              Submit Quiz
            </button>
          </div>
        ) : (
          <p className="text-green-500 font-semibold text-lg mb-4">
            Your score: {score} / {sampleQuiz.length}
          </p>
        )}

     
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 border border-violet-500 text-violet-300 rounded-lg
                    hover:bg-violet-600 hover:text-white transition font-medium"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
};

export default QuizModal;
