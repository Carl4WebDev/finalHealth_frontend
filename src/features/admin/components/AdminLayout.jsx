import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Close sidebar on route change or resize for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <AdminNavbar
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex pt-14 sm:pt-16 min-h-screen">
        {/* DESKTOP SIDEBAR — fixed position */}
        <div
          className={`hidden md:block flex-shrink-0 transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <AdminSidebar
            isOpen={true}
            setIsOpen={() => {}}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />
        </div>

        {/* MOBILE SIDEBAR (slide-in overlay) */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isMobile={true}
          isCollapsed={false}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* MAIN CONTENT — takes remaining width */}
        <main className="flex-1 min-w-0 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}