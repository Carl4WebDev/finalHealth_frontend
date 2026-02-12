import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import AdminLayout from "../../components/AdminLayout";
import SubscribersTable from "./SubscribersTable";
import SendNotificationModal from "../modals/SendNotificationModal";

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: "Mark Dela Cruz",
        email: "mark@domain.com",
        phone: "+63 912 345 6789",
        clinicName: "Dela Cruz Medical Center",
        address: "123 Main St, Manila",
        subscriptionType: "Premium",
        subscriptionDate: "2025-08-14",
        subscriptionEnd: "2026-08-14",
        status: "Active",
        paymentMethod: "Credit Card",
        lastPayment: "2025-12-14",
        notes: "Regular customer, always pays on time",
      },
      {
        id: 2,
        name: "Anna Reyes",
        email: "anna@domain.com",
        phone: "+63 917 654 3210",
        clinicName: "Reyes Family Clinic",
        address: "456 Oak Ave, Quezon City",
        subscriptionType: "Basic",
        subscriptionDate: "2025-09-02",
        subscriptionEnd: "2026-03-02",
        status: "Inactive",
        paymentMethod: "PayPal",
        lastPayment: "2025-12-02",
        notes: "Payment overdue, contacted on Dec 5",
      },
      {
        id: 3,
        name: "John Santos",
        email: "john@domain.com",
        phone: "+63 918 987 6543",
        clinicName: "Santos Health Clinic",
        address: "789 Pine St, Cebu City",
        subscriptionType: "Premium",
        subscriptionDate: "2025-10-15",
        subscriptionEnd: "2026-10-15",
        status: "Active",
        paymentMethod: "Bank Transfer",
        lastPayment: "2025-12-15",
        notes: "New subscriber, very satisfied",
      },
      {
        id: 4,
        name: "Maria Gonzales",
        email: "maria@domain.com",
        phone: "+63 919 876 5432",
        clinicName: "Gonzales Medical Group",
        address: "321 Maple Blvd, Davao",
        subscriptionType: "Enterprise",
        subscriptionDate: "2025-07-01",
        subscriptionEnd: "2026-07-01",
        status: "Active",
        paymentMethod: "Credit Card",
        lastPayment: "2025-12-01",
        notes: "Enterprise plan, multiple clinics",
      },
      {
        id: 5,
        name: "Carlos Lim",
        email: "carlos@domain.com",
        phone: "+63 920 123 4567",
        clinicName: "Lim Pediatrics",
        address: "654 Birch Rd, Makati",
        subscriptionType: "Basic",
        subscriptionDate: "2025-11-20",
        subscriptionEnd: "2026-05-20",
        status: "Active",
        paymentMethod: "Credit Card",
        lastPayment: "2025-12-20",
        notes: "Specializes in pediatric care",
      },
      {
        id: 6,
        name: "Sarah Johnson",
        email: "sarah@domain.com",
        phone: "+63 921 234 5678",
        clinicName: "Johnson Medical Clinic",
        address: "789 Elm St, Pasig",
        subscriptionType: "Premium",
        subscriptionDate: "2025-06-10",
        subscriptionEnd: "2026-06-10",
        status: "Active",
        paymentMethod: "Credit Card",
        lastPayment: "2025-12-10",
        notes: "Regular checkups, satisfied customer",
      },
      {
        id: 7,
        name: "Robert Chen",
        email: "robert@domain.com",
        phone: "+63 922 345 6789",
        clinicName: "Chen Healthcare",
        address: "456 Cedar St, Mandaluyong",
        subscriptionType: "Enterprise",
        subscriptionDate: "2025-05-15",
        subscriptionEnd: "2026-05-15",
        status: "Active",
        paymentMethod: "Bank Transfer",
        lastPayment: "2025-12-15",
        notes: "Multiple locations, corporate account",
      },
      {
        id: 8,
        name: "Lisa Wong",
        email: "lisa@domain.com",
        phone: "+63 923 456 7890",
        clinicName: "Wong Medical Center",
        address: "123 Pine St, Taguig",
        subscriptionType: "Basic",
        subscriptionDate: "2025-04-20",
        subscriptionEnd: "2025-10-20",
        status: "Inactive",
        paymentMethod: "PayPal",
        lastPayment: "2025-10-20",
        notes: "Subscription expired, not renewed",
      },
      {
        id: 9,
        name: "Michael Tan",
        email: "michael@domain.com",
        phone: "+63 924 567 8901",
        clinicName: "Tan Family Clinic",
        address: "789 Oak St, Paranaque",
        subscriptionType: "Premium",
        subscriptionDate: "2025-03-25",
        subscriptionEnd: "2026-03-25",
        status: "Active",
        paymentMethod: "Credit Card",
        lastPayment: "2025-12-25",
        notes: "Long-term customer, loyal",
      },
      {
        id: 10,
        name: "Jennifer Lee",
        email: "jennifer@domain.com",
        phone: "+63 925 678 9012",
        clinicName: "Lee Medical Services",
        address: "456 Maple St, Alabang",
        subscriptionType: "Enterprise",
        subscriptionDate: "2025-02-28",
        subscriptionEnd: "2026-02-28",
        status: "Active",
        paymentMethod: "Bank Transfer",
        lastPayment: "2025-12-28",
        notes: "Enterprise client with special requirements",
      },
      {
        id: 11,
        name: "David Kim",
        email: "david@domain.com",
        phone: "+63 926 789 0123",
        clinicName: "Kim Medical Group",
        address: "123 Birch St, BGC",
        subscriptionType: "Premium",
        subscriptionDate: "2025-01-15",
        subscriptionEnd: "2026-01-15",
        status: "Active",
        paymentMethod: "Credit Card",
        lastPayment: "2025-12-15",
        notes: "New premium subscriber",
      },
      {
        id: 12,
        name: "Amanda Garcia",
        email: "amanda@domain.com",
        phone: "+63 927 890 1234",
        clinicName: "Garcia Health Clinic",
        address: "789 Cedar St, Makati",
        subscriptionType: "Basic",
        subscriptionDate: "2025-12-01",
        subscriptionEnd: "2026-06-01",
        status: "Active",
        paymentMethod: "Credit Card",
        lastPayment: "2025-12-01",
        notes: "Recently upgraded to basic plan",
      },
    ];
    setSubscribers(mockData);
  }, []);

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch =
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.clinicName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || subscriber.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubscribers = filteredSubscribers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSubscribers(paginatedSubscribers.map((s) => s.id));
    } else {
      setSelectedSubscribers([]);
    }
  };

  const handleSelectSubscriber = (id) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id)
        ? prev.filter((subId) => subId !== id)
        : [...prev, id]
    );
  };

  const handleSendNotification = () => {
    setIsNotificationModalOpen(true);
  };

  const handleNotificationSent = (message) => {
    console.log(
      "Notification sent to:",
      selectedSubscribers,
      "Message:",
      message
    );
    alert(`Notification sent to ${selectedSubscribers.length} subscriber(s)`);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <AdminLayout>
      <div className="p-3 sm:p-4 md:p-6">
        <Header title="Subscription Management" />

        {/* Control Panel */}
        <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto">
                <select
                  className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2133ff] focus:border-transparent text-sm sm:text-base w-full xs:w-auto"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                {/* Summary badges - visible on all sizes */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    Total: {filteredSubscribers.length}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    Active:{" "}
                    {
                      filteredSubscribers.filter(
                        (s) => s.status === "Active"
                      ).length
                    }
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                    Inactive:{" "}
                    {
                      filteredSubscribers.filter(
                        (s) => s.status === "Inactive"
                      ).length
                    }
                  </span>
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <button
                  onClick={handleSendNotification}
                  disabled={selectedSubscribers.length === 0}
                  className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                    selectedSubscribers.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#2133ff] text-white hover:bg-blue-700 active:bg-blue-800"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    Send Notification ({selectedSubscribers.length})
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <SubscribersTable
            subscribers={paginatedSubscribers}
            selectedSubscribers={selectedSubscribers}
            onSelectAll={handleSelectAll}
            onSelectSubscriber={handleSelectSubscriber}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 sm:p-4 border-t border-gray-200">
              <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                Showing {startIndex + 1} to{" "}
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredSubscribers.length
                )}{" "}
                of {filteredSubscribers.length} subscribers
              </div>

              <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-2 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#2133ff] hover:bg-gray-100 active:bg-gray-200"
                  }`}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="hidden xs:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {/* Show first page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm text-gray-600 hover:bg-gray-100"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="text-gray-400 px-1">...</span>
                      )}
                    </>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (totalPages <= 5) return true;
                      return (
                        Math.abs(page - currentPage) <= 1 ||
                        page === 1 ||
                        page === totalPages
                      );
                    })
                    .filter((page) => {
                      if (currentPage > 3 && page === 1) return false;
                      if (currentPage < totalPages - 2 && page === totalPages)
                        return false;
                      return true;
                    })
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm ${
                          currentPage === page
                            ? "bg-[#2133ff] text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  {/* Show last page */}
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="text-gray-400 px-1">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm text-gray-600 hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-2 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#2133ff] hover:bg-gray-100 active:bg-gray-200"
                  }`}
                >
                  <span className="hidden xs:inline">Next</span>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Send Notification Modal */}
        <SendNotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
          onSend={handleNotificationSent}
          selectedCount={selectedSubscribers.length}
        />
      </div>
    </AdminLayout>
  );
}