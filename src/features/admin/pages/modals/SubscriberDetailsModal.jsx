import React from "react";

export default function SubscriberDetailsModal({ isOpen, onClose, subscriber }) {
  if (!isOpen || !subscriber) return null;

  return (
    <div className="fixed inset-0 bg-blue-50/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Subscriber Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 pb-2 border-b">Personal Information</h3>
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="font-medium">{subscriber.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email Address</label>
                <p className="font-medium">{subscriber.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone Number</label>
                <p className="font-medium">{subscriber.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Clinic Name</label>
                <p className="font-medium">{subscriber.clinicName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Address</label>
                <p className="font-medium">{subscriber.address}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 pb-2 border-b">Subscription Details</h3>
              <div>
                <label className="text-sm text-gray-500">Subscription Type</label>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  subscriber.subscriptionType === "Premium" 
                    ? "bg-blue-100 text-blue-800"
                    : subscriber.subscriptionType === "Enterprise"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {subscriber.subscriptionType}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  subscriber.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {subscriber.status}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-500">Subscription Start</label>
                <p className="font-medium">{subscriber.subscriptionDate}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Subscription End</label>
                <p className="font-medium">{subscriber.subscriptionEnd}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Payment Method</label>
                <p className="font-medium">{subscriber.paymentMethod}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Last Payment</label>
                <p className="font-medium">{subscriber.lastPayment}</p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 pb-2 border-b">Notes</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700">{subscriber.notes}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={() => {
              console.log("Edit subscriber:", subscriber.id);
            }}
            className="px-6 py-2 bg-[#2133ff] text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
          >
            Edit Subscriber
          </button>
        </div>

      </div>
    </div>
  );
}
