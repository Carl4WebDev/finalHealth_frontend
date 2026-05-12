import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  CreditCardIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { useUser } from "../context/users/useUser";

import { Link } from "react-router-dom";

export default function Sidebar({
  isOpen,
  setIsOpen,
  isMobile = false,
}) {
  const { getPersonalInfo, userInfo } = useUser();
  // Initialize from localStorage or default to false (expanded)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    getPersonalInfo();
  }, []);

  // Save to localStorage whenever collapsed state changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const menu = [
    {
      name: "Dashboard",
      icon: <HomeIcon className="h-5 w-5" />,
      link: "/user/dashboard",
    },
    {
      name: "Appointments",
      icon: <CalendarIcon className="h-5 w-5" />,
      link: "/user/appointments",
    },
    {
      name: "Patients",
      icon: <UsersIcon className="h-5 w-5" />,
      link: "/user/patients",
    },
    {
      name: "Doctor Schedule",
      icon: <ClockIcon className="h-5 w-5" />,
      link: "/user/doctor-clinic-management",
    },
    {
      name: "Subscription",
      icon: <CreditCardIcon className="h-5 w-5" />,
      link: "/user/subscription",
    },
    {
      name: "Profile",
      icon: <UserIcon className="h-5 w-5" />,
      link: "/user/profile",
    },
  ];

  const getProfileImageSrc = () => {
    if (userInfo?.profile.profileImgPath)
      return userInfo.profile.profileImgPath;

    const initials =
      userInfo?.profile.fName || userInfo?.profile.lName
        ? `${userInfo.profile.fName || ""} ${userInfo.profile.lName || ""}`
            .trim()
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "U";

    return `https://ui-avatars.com/api/?name=${initials}&background=3B82F6&color=fff&bold=true&size=128`;
  };

  const fullName =
    `${userInfo?.profile.fName || ""} ${userInfo?.profile.mName || ""} ${userInfo?.profile.lName || ""}`.trim() ||
    "N/A";

  const email = userInfo?.user.email || "N/A";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/40 z-20 md:hidden ${isOpen ? "block" : "hidden"}`}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 
          border-r border-blue-100 dark:border-gray-700 fixed left-0 top-16 z-30
          h-[calc(100vh-4rem)] overflow-y-auto
          transition-all duration-300 ease-in-out
          ${
            isMobile
              ? `w-72 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden shadow-xl`
              : isCollapsed
                ? "hidden md:block w-24"
                : "hidden md:block w-72"
          }
        `}
      >
        <div className="flex flex-col h-full">
          {/* USER PROFILE SECTION */}
          <div className="p-6 pb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={getProfileImageSrc()}
                  className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  alt="Profile"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg truncate">
                    {fullName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {email}
                  </p>
                </div>
              )}

              {/* COLLAPSE BUTTON - REDESIGNED */}
              {!isMobile && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isCollapsed 
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                      : "bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300 hover:shadow-lg"
                  }`}
                  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <div className="w-5 h-5 relative">
                    <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      isCollapsed ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </span>
                    <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      isCollapsed ? "rotate-0 opacity-100" : "rotate-180 opacity-0"
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* CLINIC NAME - From your image */}
            {!isCollapsed && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-md">
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">Network Clinics and DDS</p>
                  <div className="mt-2 flex items-center justify-center space-x-3">
                    <div className="flex items-center text-white/90">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs">32°C</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs">Mostly sunny</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NAVIGATION MENU */}
          <nav className="px-4 py-2 flex-grow">
            <div className="space-y-1">
              {menu.map((m, index) => (
                <Link
  key={index}
  to={m.link}
                  className={`
                    group flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-200 ease-in-out
                    hover:bg-blue-100 dark:hover:bg-blue-900/30
                    hover:shadow-md hover:scale-[1.02]
                    active:scale-[0.98]
                    ${isCollapsed ? "justify-center" : ""}
                  `}
             onClick={() => {
  setIsCollapsed(true);

  if (isMobile) {
    setIsOpen(false);
  }
}}
                >
                  <span className={`
                    text-blue-600 dark:text-blue-400
                    transition-transform duration-200
                    group-hover:scale-110
                    ${isCollapsed ? "mx-auto" : ""}
                  `}>
                    {m.icon}
                  </span>
                  
                  {!isCollapsed && (
                    <>
                      <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {m.name}
                      </span>
                      <span className="flex-1"></span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transform -rotate-45 group-hover:rotate-0 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* LOGOUT SECTION */}
          <div className="p-4 border-t border-blue-100 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className={`
                group w-full px-4 py-3 rounded-xl
                bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950
                text-white font-medium
                transition-all duration-200 ease-in-out
                hover:shadow-lg hover:scale-[1.02]
                active:scale-[0.98]
                ${isCollapsed ? "flex justify-center" : "flex items-center space-x-3"}
              `}
            >
              <svg className={`w-5 h-5 transform transition-transform duration-200 group-hover:translate-x-1 ${isCollapsed ? "" : "mr-2"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!isCollapsed && (
                <>
                  <span>Logout</span>
                  <span className="flex-1"></span>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}