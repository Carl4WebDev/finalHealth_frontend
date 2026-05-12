import React from "react";

export default function SubscriberDetailsModal({ isOpen, onClose, subscriber }) {
  if (!isOpen || !subscriber) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-blue-50/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Subscriber Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 pb-2 border-b">Personal Information</h3>
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="font-medium text-gray-900">{subscriber.f_name} {subscriber.l_name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email Address</label>
                <p className="font-medium text-gray-900">{subscriber.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone Number</label>
                <p className="font-medium text-gray-900">{subscriber.contact_num || "Not Provided"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Address</label>
                <p className="font-medium text-gray-900">{subscriber.address || "N/A"}</p>
              </div>
            </div>

            {/* Subscription Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 pb-2 border-b">Subscription Details</h3>
              <div>
                <label className="text-sm text-gray-500">Subscription Type</label>
                <p className="font-medium text-gray-900">{subscriber.plan_name || "No Plan"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  subscriber.subscription_status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {subscriber.subscription_status || "Inactive"}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-500">Subscription Start</label>
                <p className="font-medium text-gray-900">{formatDate(subscriber.start_date)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Subscription End</label>
                <p className="font-medium text-gray-900">{formatDate(subscriber.end_date)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Last Payment</label>
                <p className="font-medium text-gray-900">{formatDate(subscriber.last_payment_date)}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}