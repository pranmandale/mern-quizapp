import { useEffect, useState } from "react";
import { User, Lock, Check, AlertCircle, Loader2, Save } from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/current-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
      } else {
        setMessage({ type: "error", text: "Failed to load user data." });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setMessage({ type: "error", text: "Error fetching user data." });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setMessage({ type: "", text: "" });

    if (!oldPassword || !newPassword) {
      setMessage({ type: "error", text: "Both fields are required." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setOldPassword("");
        setNewPassword("");
      } else {
        setMessage({ type: "error", text: data.message || "Failed to change password. Please try again." });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({ type: "error", text: "An error occurred." });
    } finally {
      setIsSubmitting(false);
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
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
          message.type === "success" 
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-500" />
            Change Password
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                id="oldPassword"
                type="password"
                placeholder="Enter your current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>
            
            <button
              onClick={handleChangePassword}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
