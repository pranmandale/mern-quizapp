

import { useEffect, useState } from "react";
import { User, Check, AlertCircle, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/current-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
      });

      const data = await response.json();
      if (data?.success && data?.data) {
        setUser(data.data); // Make sure the data structure matches the API
      } else {
        setMessage({ type: "error", text: data.message || "Failed to load user data." });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setMessage({ type: "error", text: "Error fetching user data." });
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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
        <User className="h-6 w-6 text-blue-500" />
        Profile
      </h1>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === "success"
          ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
          : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
          }`}>
          {message.type === "success" ? (
            <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {user && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                <p className="text-gray-900 dark:text-white font-medium">{user.fullName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Username</p>
                <p className="text-gray-900 dark:text-white font-medium">{user.username}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
