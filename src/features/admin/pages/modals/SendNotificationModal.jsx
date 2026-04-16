import React, { useState } from "react";

export default function SendNotificationModal({ 
  isOpen, 
  onClose, 
  onSend, 
  selectedCount 
}) {
  const [notificationType, setNotificationType] = useState("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }
    // Updated: passing both subject and message
    onSend(message, subject);
    onClose();
    setSubject("");
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-50/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        
        {/* Header */}
        <div className="p-6 border-b flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Send Notification</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Sending to {selectedCount} selected subscriber(s)
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} id="notification-form" className="space-y-6">
            <div className="space-y-4">

              {/* Notification Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Type
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="notificationType"
                      value="email"
                      checked={notificationType === "email"}
                      onChange={(e) => setNotificationType(e.target.value)}
                      className="mr-2 w-4 h-4 text-[#2133ff]"
                    />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center cursor-pointer opacity-50">
                    <input
                      type="radio"
                      name="notificationType"
                      value="sms"
                      disabled
                      className="mr-2 w-4 h-4"
                    />
                    <span>SMS (Coming Soon)</span>
                  </label>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter notification subject"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2133ff] focus:border-transparent"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your notification message here..."
                  rows="6"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2133ff] focus:border-transparent"
                  required
                />
              </div>

              {/* Preview */}
              {message && (
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto text-sm">
                    {message}
                  </div>
                </div>
              )}

              {/* Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Templates
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                        setSubject("Renewal Reminder");
                        setMessage("Dear subscriber,\n\nThis is a reminder that your subscription will be renewing soon. Please ensure your payment method is up to date.\n\nThank you,\nFinalHealth Team");
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200"
                  >
                    Renewal Reminder
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                        setSubject("New Feature Update");
                        setMessage("Dear subscriber,\n\nWe're excited to announce new features! Login to your dashboard to explore the latest updates.\n\nBest regards,\nFinalHealth Team");
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200"
                  >
                    Feature Update
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              form="notification-form"
              type="submit"
              className="px-6 py-2 bg-[#2133ff] text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}