'use client';
import React, { useState } from "react";
import AssignmentForm from "../Elements/AssignmentForm";
import QuizModal from "../Elements/QuizModal";

interface Progress {
  lessonTitle: string;
  completed: boolean;
}

interface LessonItemProps {
  lesson: Progress;
  enrollId: string;
  markCompleted: (enrollId: string, lessonTitle: string) => void;
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson, enrollId, markCompleted }) => {
  const [showAssignment, setShowAssignment] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleComplete = () => {
    markCompleted(enrollId, lesson.lessonTitle);
    setShowAssignment(true);
  };

  return (
    <div className="flex flex-col mb-2">
      <div className="flex items-center justify-between">
        <span>{lesson.lessonTitle}</span>

        {!lesson.completed && (
          <button
            className="text-white bg-violet-600 px-2 py-1 rounded hover:bg-indigo-700 text-sm"
            onClick={handleComplete}
          >
            Mark Complete
          </button>
        )}

        {lesson.completed && (
          <div className="flex items-center gap-2">
            <span className="text-green-500 font-semibold text-sm">✓ Completed</span>
            <button
              className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowQuiz(true)}
            >
              Participate Quiz
            </button>
          </div>
        )}
      </div>

      {showAssignment && <AssignmentForm lessonTitle={lesson.lessonTitle} />}
      {showQuiz && <QuizModal lessonTitle={lesson.lessonTitle} onClose={() => setShowQuiz(false)} />}
    </div>
  );
};

export default LessonItem;
