import React, { useState } from "react";

export default function Header({ title = "Dashboard" }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="w-full bg-white py-3 px-3 sm:py-4 sm:px-4 md:px-6 rounded-xl shadow-sm">
      {/* Main header row */}
      <div className="flex items-center justify-between gap-3">
        {/* Title */}
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate">
          {title}
        </h1>

        {/* Desktop search bar - hidden on small screens */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              className="w-64 lg:w-80 xl:w-96 rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2133ff] focus:border-transparent transition-all"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Mobile/Tablet actions */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Search toggle button */}
          <button
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className={`p-2 rounded-lg transition-colors ${
              isSearchOpen
                ? "bg-[#2133ff] text-white"
                : "text-gray-600 hover:bg-gray-100 active:bg-gray-200"
            }`}
            aria-label="Toggle search"
          >
            {isSearchOpen ? (
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
            ) : (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar - expands below header */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isSearchOpen ? "max-h-20 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2133ff] focus:border-transparent transition-all"
            placeholder="Search..."
            autoFocus={isSearchOpen}
          />
        </div>
      </div>
    </header>
  );
}