import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, UserCircle2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const Leaderboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // console.log(id);
  
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/${id}/leaderboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.data);
      } else {
        toast.error(data.message || "Failed to fetch leaderboard.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        <div className="p-4 bg-gray-100 dark:bg-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Top Scorers</h2>
        </div>

        {leaderboard.length === 0 ? (
          <p className="p-6 text-gray-500 dark:text-gray-400">No results available yet.</p>
        ) : (
          <ul>
            {leaderboard.map((entry, index) => (
              <li
                key={entry._id}
                className={`p-4 flex items-center justify-between border-b dark:border-gray-700 ${
                  index === 0 ? "bg-yellow-100 dark:bg-yellow-800" : "bg-white dark:bg-gray-800"
                }`}
              >
                {/* User Section */}
                <div className="flex items-center gap-4">
                  {index === 0 ? (
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  ) : (
                    <UserCircle2 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  )}
                  <div>
                    <p className="text-lg font-medium text-gray-800 dark:text-white">{entry.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Completed on {new Date(entry.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Score Section */}
                <span
                  className={`text-lg font-semibold ${
                    index === 0 ? "text-yellow-600 dark:text-yellow-400" : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {entry.score} Pts
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
