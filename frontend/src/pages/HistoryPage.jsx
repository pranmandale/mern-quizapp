import { useEffect, useState } from "react";
import { CalendarClock, Award, AlertCircle, Loader2 } from 'lucide-react';

const HistoryPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/user/attempts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAttempts(data.data);
      } else {
        console.error("Failed to fetch attempts");
      }
    } catch (error) {
      console.error("Error fetching attempts:", error);
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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CalendarClock className="h-6 w-6 text-blue-500" />
          Quiz History
        </h1>
      </div>

      {attempts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No quiz attempts yet</h3>
          <p className="text-gray-500 dark:text-gray-400">
            You haven't attempted any quizzes yet. Start by joining a quiz!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <div
              key={attempt._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {attempt.quizId ? attempt.quizId.title : "Deleted Quiz"}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CalendarClock className="h-4 w-4 mr-1.5" />
                    <time dateTime={new Date(attempt.completedAt).toISOString()}>
                      {new Date(attempt.completedAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg">
                    <Award className="h-4 w-4" />
                    <span className="font-medium">Score: {attempt.score}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
