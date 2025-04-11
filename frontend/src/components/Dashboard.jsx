
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash, Eye, Share2, Plus, Loader2, AlertCircle, Clipboard } from 'lucide-react';
import { toast } from "react-toastify";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/my-quizzes`, {
        credentials: "include", // ✅ Send cookies
      });

      const data = await response.json();
      if (data.success) {
        setQuizzes(data.data);
      }
      // else {
      //   toast.error(data.message || "Failed to fetch quizzes.");
      // }
    } catch (error) {
      toast.error("An error occurred while fetching quizzes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/${id}/delete`, {
        method: "DELETE",
        credentials: "include", // ✅ Send cookies
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Quiz deleted successfully.");
        setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
      } else {
        toast.error(data.message || "Failed to delete quiz.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the quiz.");
    }
  };

  const handleShare = (id) => {
    const quizLink = `${window.location.origin}/attempt-quiz/${id}`;
    navigator.clipboard.writeText(quizLink);
    toast.success("Quiz link copied to clipboard!");
  };

  const handleCopyQuizId = (id) => {
    navigator.clipboard.writeText(id);
    toast.success("Quiz ID copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Quizzes</h1>
        <Link
          to="/create-quiz"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No quizzes found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't created any quizzes yet. Create your first quiz to get started!
          </p>
          <Link
            to="/create-quiz"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create New Quiz
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
            >
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{quiz.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {quiz.description || "No description provided"}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {quiz.questions?.length || 0} Questions
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                    {quiz.timeLimit} min
                  </span>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Created on: {new Date(quiz.createdAt).toLocaleDateString()}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                  <span className="font-medium">Quiz ID:</span> {quiz._id}
                  <button
                    onClick={() => handleCopyQuizId(quiz._id)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                    title="Copy Quiz ID"
                  >
                    <Clipboard className="h-4 w-4 inline-block" />
                  </button>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  <span className="font-medium">Quiz Link:</span> {`${window.location.origin}/attempt-quiz/${quiz._id}`}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 flex justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Delete quiz"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                  <Link
                    to={`/edit-quiz/${quiz._id}`}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    aria-label="Edit quiz"
                  >
                    <Pencil className="h-5 w-5" />
                  </Link>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/leaderboard/${quiz._id}`}
                    className="text-green-500 hover:text-green-700 transition-colors"
                    aria-label="View quiz"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleShare(quiz._id)}
                    className="text-purple-500 hover:text-purple-700 transition-colors"
                    aria-label="Share quiz"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
