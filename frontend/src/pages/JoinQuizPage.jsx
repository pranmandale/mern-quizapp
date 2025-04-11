import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, ArrowRight } from 'lucide-react';

const JoinQuizPage = () => {
  const [quizId, setQuizId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoinQuiz = () => {
    if (!quizId.trim()) {
      setError("Please enter a valid Quiz ID");
      return;
    }
    navigate(`/attempt-quiz/${quizId}`);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Join Quiz</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Enter the Quiz ID to join an existing quiz
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="quizId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quiz ID
            </label>
            <input
              id="quizId"
              type="text"
              placeholder="Enter the Quiz ID"
              value={quizId}
              onChange={(e) => {
                setQuizId(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <button
            onClick={handleJoinQuiz}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Join Quiz
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinQuizPage;
