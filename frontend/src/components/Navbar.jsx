"use client"

import { useState, useContext, useEffect } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, Sun, Moon, Monitor, LogOut, User } from "lucide-react"
import { ThemeContext } from "../context/ThemeContext"
import { toast } from "react-toastify"

const Navbar = () => {
  const { theme, setTheme } = useContext(ThemeContext)
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setIsOpen(false)
    setIsProfileOpen(false)
  }, [location.pathname])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest(".profile-menu")) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isProfileOpen])

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("accessToken"); 
        toast.success("Logged out successfully!");
        navigate("/login");
      } else {
        const data = await response.json();
        toast.error(data.message || "Logout failed!");
      }
    } catch (error) {
      toast.error("An error occurred while logging out.");
    }
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">QuizMaster</span>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/create-quiz"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              Create Quiz
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              History
            </NavLink>
            <NavLink
              to="/join-quiz"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              Join Quiz
            </NavLink>
          </div>

          {/* Right Side - Theme Toggle & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-md ${theme === "light" ? "bg-white dark:bg-gray-600 shadow-sm" : ""}`}
                aria-label="Light mode"
              >
                <Sun className="h-4 w-4 text-amber-500" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-md ${theme === "dark" ? "bg-white dark:bg-gray-600 shadow-sm" : ""}`}
                aria-label="Dark mode"
              >
                <Moon className="h-4 w-4 text-indigo-500" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-md ${theme === "system" ? "bg-white dark:bg-gray-600 shadow-sm" : ""}`}
                aria-label="System mode"
              >
                <Monitor className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative profile-menu">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Your Profile
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/create-quiz"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              Create Quiz
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              History
            </NavLink>
            <NavLink
              to="/join-quiz"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              Join Quiz
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              Profile
            </NavLink>

            <button
              onClick={handleLogout}
              className=" w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>

            {/* Mobile Theme Toggle */}
            <div className="px-3 py-3 flex justify-center">
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-1.5 rounded-md ${theme === "light" ? "bg-white dark:bg-gray-600 shadow-sm" : ""}`}
                  aria-label="Light mode"
                >
                  <Sun className="h-4 w-4 text-amber-500" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-1.5 rounded-md ${theme === "dark" ? "bg-white dark:bg-gray-600 shadow-sm" : ""}`}
                  aria-label="Dark mode"
                >
                  <Moon className="h-4 w-4 text-indigo-500" />
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`p-1.5 rounded-md ${theme === "system" ? "bg-white dark:bg-gray-600 shadow-sm" : ""}`}
                  aria-label="System mode"
                >
                  <Monitor className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

