import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  CreditCardIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

import Logo from "../../../assets/logo.png";

export default function Sidebar({ isOpen, setIsOpen, isMobile = false }) {
  const [userInfo, setUserInfo] = useState({
    fullName: "N/A",
    email: "N/A",
    profileImgUrl: null,
  });

  useEffect(() => {
    function loadUserInfo() {
      try {
        const stored = JSON.parse(localStorage.getItem("user")) || {};

        const fullName = `${stored.firstName || ""} ${
          stored.middleName || ""
        } ${stored.lastName || ""}`.trim();

        setUserInfo({
          fullName: fullName || "N/A",
          email: stored.email || "N/A",
          profileImgUrl: stored.profileImgUrl || null,
        });
      } catch (err) {
        console.error("Failed to load userInformations:", err);
      }
    }

    loadUserInfo(); // call the wrapper function
  }, []);

  const menu = [
    {
      name: "Dashboard",
      icon: <HomeIcon className="h-5" />,
      link: "/user/dashboard",
    },
    {
      name: "Appointments",
      icon: <CalendarIcon className="h-5" />,
      link: "/user/appointments",
    },
    {
      name: "Patients",
      icon: <UsersIcon className="h-5" />,
      link: "/user/patients",
    },
    {
      name: "Doctor Schedule",
      icon: <ClockIcon className="h-5" />,
      link: "/user/doctor-clinic-management",
    },
    {
      name: "Subscription",
      icon: <CreditCardIcon className="h-5" />,
      link: "/user/subscription",
    },
    {
      name: "Profile",
      icon: <UserIcon className="h-5" />,
      link: "/user/profile",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/40 z-20 md:hidden ${
            isOpen ? "block" : "hidden"
          }`}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          bg-white shadow-lg fixed left-0 h-[calc(100vh-4rem)] top-16 overflow-y-auto
          ${
            isMobile
              ? `w-64 z-30 transform ${
                  isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-200 md:hidden`
              : `hidden md:block w-64`
          }
        `}
      >
        {/* Container for content with flex column layout */}
        <div className="flex flex-col h-full">
          {/* HEADER - Adjusted spacing since navbar is above */}
          <div className="p-4 pb-2 flex items-center space-x-3">
            <img
              src={userInfo.profileImgUrl || Logo}
              className="w-14 h-14 rounded-full"
              alt="Profile"
            />
            <div className="flex flex-col">
              <p className="font-semibold">{userInfo.fullName}</p>
              <p className="text-sm text-gray-500">{userInfo.email}</p>
            </div>
          </div>

          {/* MENU - This will scroll if content is too long */}
          <nav className="p-4 space-y-1 flex-grow">
            {menu.map((m, i) => (
              <a
                key={i}
                href={m.link}
                className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-100"
                onClick={() => isMobile && setIsOpen(false)}
              >
                {m.icon}
                <span>{m.name}</span>
              </a>
            ))}
          </nav>

          {/* LOGOUT - Fixed at bottom */}
          <div className="p-4 mt-auto border-t border-gray-100">
            <button
              className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-100 w-full"
              onClick={() => {
                localStorage.removeItem("user_token");
                localStorage.removeItem("user");
                localStorage.removeItem("selectedDoctorId");
                localStorage.removeItem("selectedClinicId");
                localStorage.removeItem("selectedDoctorIdPatientPage");
                localStorage.removeItem("selectedClinicIdPatientPage");
                window.location.href = "/";
              }}
            >
              <ArrowLeftOnRectangleIcon className="h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}