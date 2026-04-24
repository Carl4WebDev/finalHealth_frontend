import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    // APP SHELL OWNS THE BACKGROUND
    <div className="min-h-screen ">
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />

      {/* FIXED DESKTOP SIDEBAR */}
      <div className="hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)] z-30">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* MOBILE SIDEBAR (SLIDE-IN) */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isMobile={true}
      />

      {/* MAIN CONTENT — FULL WIDTH, TRANSPARENT */}
      <main
        className={`pt-16 p-5 pb-10 min-h-screen transition-all duration-200 ${
          isCollapsed ? "md:pl-20" : "md:pl-28"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
