"use client"

import { useContext } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { LayoutDashboard, FilePlus, History, KeyRound, Brain, User, BookOpen } from "lucide-react"
import { ThemeContext } from "../context/ThemeContext"

const Sidebar = () => {
  const { theme } = useContext(ThemeContext)
  const location = useLocation()

  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/create-quiz", icon: <FilePlus size={20} />, label: "Create Quiz" },
    { to: "/history", icon: <History size={20} />, label: "History" },
    { to: "/join-quiz", icon: <KeyRound size={20} />, label: "Join Quiz" },
    { to: "/ai-quiz", icon: <Brain size={20} />, label: "AI Quiz" },
    { to: "/profile", icon: <User size={20} />, label: "Profile" },
  ]

  return (
    <aside className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-16 md:w-64 hidden sm:block bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="h-full px-3 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">{item.icon}</div>
                <span className="ml-3 hidden md:block">{item.label}</span>
                {location.pathname === item.to && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-blue-600 dark:bg-blue-500 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <NavLink
            to="/help"
            className="flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
          >
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <span className="ml-3 hidden md:block">Help & Resources</span>
          </NavLink>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

