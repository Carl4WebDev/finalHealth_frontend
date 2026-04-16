import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import AdminLayout from "../../components/AdminLayout";
import SubscribersTable from "./SubscribersTable";
import SendNotificationModal from "../modals/SendNotificationModal";
import { useAdmin } from "../../../admin/context/useAdmin";

export default function Subscribers() {
  const { subscribers, loading, error, getAllSubscribers } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    getAllSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch = subscriber.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      subscriber.subscription_status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubscribers = filteredSubscribers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSubscribers(
        paginatedSubscribers.map((s) => `${s.user_id}-${s.subscription_id}`),
      );
    } else {
      setSelectedSubscribers([]);
    }
  };

  const handleSelectSubscriber = (key) => {
    setSelectedSubscribers((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key],
    );
  };

  const handleSendNotification = () => {
    setIsNotificationModalOpen(true);
  };

  const handleNotificationSent = async (message, subject) => {
  setIsSending(true);
  
  const targetedSubscribers = subscribers.filter(s => 
    selectedSubscribers.includes(`${s.user_id}-${s.subscription_id}`)
  );

  // --- EMAILJS CONFIG ---
  const SERVICE_ID = "service_d4wyl2e";
  const TEMPLATE_ID = "template_ra5y0ek";
  const PUBLIC_KEY = "ZHn8_FBOZfQ8daVBK";

  try {
    const requests = targetedSubscribers.map(sub => 
      fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: {
            user_email: sub.email,    // matches {{user_email}} in template
            user_name: `${sub.f_name} ${sub.l_name}`, 
            subject: subject,          // matches {{subject}} in template
            message: message           // matches {{message}} in template
          }
        })
      })
    );

    await Promise.all(requests);
    alert(`Success! Notifications sent via EmailJS to ${targetedSubscribers.length} recipients.`);
    setSelectedSubscribers([]);
  } catch (err) {
    console.error("EmailJS Error:", err);
    alert("Failed to send emails.");
  } finally {
    setIsSending(false);
  }
};

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <Header title="Subscription Management" />

        <div className="mt-6 bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by email..."
                className="w-full md:w-80 rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2133ff]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2133ff]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={handleSendNotification}
                disabled={selectedSubscribers.length === 0 || isSending}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  selectedSubscribers.length === 0 || isSending
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#2133ff] text-white hover:bg-blue-700"
                }`}
              >
                {isSending ? "Sending..." : `Send Notification (${selectedSubscribers.length})`}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading subscribers...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : (
            <SubscribersTable
              subscribers={paginatedSubscribers}
              selectedSubscribers={selectedSubscribers}
              onSelectAll={handleSelectAll}
              onSelectSubscriber={handleSelectSubscriber}
            />
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSubscribers.length)} of {filteredSubscribers.length}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium ${currentPage === 1 ? "text-gray-400" : "text-[#2133ff] hover:bg-gray-100"}`}
                >
                  Previous
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium ${currentPage === totalPages ? "text-gray-400" : "text-[#2133ff] hover:bg-gray-100"}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

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