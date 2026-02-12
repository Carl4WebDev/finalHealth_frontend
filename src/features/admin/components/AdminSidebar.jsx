import {
  HomeIcon,
  UsersIcon,
  CheckIcon,
  CreditCardIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

import Logo from "../../../assets/logo.png";

export default function AdminSidebar({
  isOpen,
  setIsOpen,
  isMobile = false,
  isCollapsed = false,
  setIsCollapsed,
}) {
  const admin = JSON.parse(localStorage.getItem("admin"));

  // Get current path for active state
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const menu = [
    {
      name: "Dashboard",
      icon: <HomeIcon className="h-5 w-5 flex-shrink-0" />,
      link: "/admin/admin-dashboard",
    },
    {
      name: "Subscribers",
      icon: <CreditCardIcon className="h-5 w-5 flex-shrink-0" />,
      link: "/admin/admin-subscribers",
    },
  ];

  const isActive = (link) => currentPath === link || currentPath.startsWith(link + "/");

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");
    window.location.href = "/admin/admin-login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`bg-white shadow-lg flex flex-col ${
          isMobile
            ? `fixed inset-y-0 left-0 w-72 sm:w-80 z-30 transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-300 ease-in-out md:hidden`
            : `hidden md:flex fixed top-14 sm:top-16 bottom-0 left-0 transition-all duration-300 ${
                isCollapsed ? "w-16" : "w-64"
              }`
        }`}
      >
        {/* HEADER */}
        <div
          className={`flex items-center border-b border-gray-100 flex-shrink-0 ${
            isCollapsed && !isMobile
              ? "justify-center p-3"
              : "p-3 sm:p-4 gap-3"
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0 overflow-hidden">
            <img
              src={Logo}
              className="rounded-full w-full h-full object-cover"
              alt="Admin Logo"
            />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-gray-800 truncate">
                {admin?.email || "Admin"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          )}

          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 flex-shrink-0 ml-auto"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1">
          {(!isCollapsed || isMobile) && (
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu
            </p>
          )}
          {menu.map((m, i) => (
            <a
              key={i}
              href={m.link}
              className={`flex items-center rounded-xl transition-all duration-150 group relative ${
                isCollapsed && !isMobile
                  ? "justify-center p-3"
                  : "gap-3 px-3 py-2.5"
              } ${
                isActive(m.link)
                  ? "bg-[#2133ff] text-white shadow-md shadow-blue-200"
                  : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
              }`}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <span
                className={
                  isActive(m.link) ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                }
              >
                {m.icon}
              </span>
              {(!isCollapsed || isMobile) && (
                <span className="text-sm font-medium">{m.name}</span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                  {m.name}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              )}
            </a>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="flex-shrink-0 border-t border-gray-100 p-2 sm:p-3">
          <button
            className={`flex items-center rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 active:bg-red-100 transition-all duration-150 w-full group relative ${
              isCollapsed && !isMobile
                ? "justify-center p-3"
                : "gap-3 px-3 py-2.5"
            }`}
            onClick={handleLogout}
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
            {(!isCollapsed || isMobile) && (
              <span className="text-sm font-medium">Logout</span>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                Logout
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            )}
          </button>

          {(!isCollapsed || isMobile) && (
            <p className="mt-2 px-3 pb-1 text-xs text-gray-400 truncate">
              v1.0.0
            </p>
          )}
        </div>
      </aside>
    </>
  );
}