import React, { useState, useRef, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function AdminNavbar({
  setIsSidebarOpen,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const admin = JSON.parse(localStorage.getItem("admin"));

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-20">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="hidden md:flex p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className={`h-5 w-5 transition-transform duration-300 ${
                isSidebarCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Title */}
          <span className="font-semibold text-base sm:text-lg text-gray-800 truncate">
            Admin Panel
          </span>
        </div>
      </div>
    </header>
  );
}