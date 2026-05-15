import React from "react";

export default function SubscriptionModal({
  isOpen,
  onClose,
  openAuthModal, // ← this opens register
}) {
  if (!isOpen) return null;

  const plans = [
    {
      id: 1,
      title: "Free Trial",
      price: "₱0",
      subtitle: "/forever",
      features: [
        "1 user access",
        "Basic clinic tools (appointments, queueing, doctor and clinic management)",
        "Limited support",
      ],
      disabled: true,
    },
    {
      id: 2,
      title: "Monthly Plan",
      price: "₱499",
      subtitle: "/month",
      features: [
        "2 user access",
        "Full feature access",
        "Priority support",
        "Cancel anytime",
        "50 medical record each patient",
      ],
      popular: true,
    },
    {
      id: 3,
      title: "Annual Plan",
      price: "₱4,999",
      subtitle: "/year",
      features: [
        "more than 5 users",
        "Full feature + analytics",
        "24/7 support",
      ],
    },
  ];

  const handleSelect = () => {
    onClose();
    openAuthModal("register");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-blue-50/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-6xl rounded-2xl border-4 border-blue-600 shadow-2xl p-6 md:p-10 max-h-[90vh] overflow-y-auto z-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">
            Choose Your Plan
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative bg-white rounded-2xl border-2 p-6 transition-all
                ${
                  p.popular
                    ? "border-blue-600 shadow-xl scale-105"
                    : "border-blue-100 shadow-md"
                }`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-blue-600 text-center mb-2">
                {p.title}
              </h3>

              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {p.price}
                </span>
                <span className="text-blue-500 ml-1">{p.subtitle}</span>
              </div>

              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                {p.features.map((f, i) => (
                  <li key={i}>✔ {f}</li>
                ))}
              </ul>

              <button
                onClick={handleSelect}
                className={`w-full py-3 rounded-lg font-semibold transition bg-blue-600 hover:bg-blue-700 text-white`}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
