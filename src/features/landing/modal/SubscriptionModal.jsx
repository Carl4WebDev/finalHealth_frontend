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
        { text: "Card only", available: true },
        { text: "Change profile", available: false },
        { text: "Add doctors", available: false },
        { text: "Add clinics", available: false },
        { text: "Manage Diagnosis & Treatment: add diagnosis/treatment", available: false },
        { text: "Add fee, lab result, prescription, certificate", available: true },
        { text: "Dashboard access", available: false },
        { text: "Add appointments", available: false },
      ],
      disabled: true,
      note: "Card Only",
    },
    {
      id: 2,
      title: "Monthly Plan",
      price: "₱499",
      subtitle: "/month",
      features: [
        { text: "Dashboard access", available: true },
        { text: "Change profile info", available: true },
        { text: "Add doctors & clinics", available: true },
        { text: "View patient records", available: true },
        { text: "Manage Diagnosis & Treatment: full access", available: true },
        { text: "Add appointments (with limitations)", available: true },
        { text: "5 user access", available: true },
        { text: "Priority support", available: true },
        { text: "Cancel anytime", available: true },
        { text: "Data backup", available: true },
      ],
      popular: true,
      note: "Billed monthly, cancel anytime",
    },
    {
      id: 3,
      title: "Annual Plan",
      price: "₱4,999",
      subtitle: "/year",
      features: [
        { text: "Everything from Monthly Plan", available: true },
        { text: "No limitations on appointments", available: true },
        { text: "Full feature access + analytics", available: true },
        { text: "24/7 priority support", available: true },
        { text: "2 months free (save 17%)", available: true },
        { text: "Dedicated account manager", available: true },
        { text: "Up to 10 users", available: true },
      ],
      note: "Equivalent to ₱416/month",
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
              className={`relative bg-white rounded-2xl border-2 p-6 transition-all flex flex-col
                ${
                  p.popular
                    ? "border-blue-600 shadow-xl scale-105 z-10"
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

              <ul className="space-y-2 mb-6 text-sm text-gray-700 flex-grow">
                {p.features.map((f, i) => (
                  <li key={i} className={!f.available ? "opacity-60" : ""}>
                    {f.available ? (
                      <span className="text-green-600 mr-2">✓</span>
                    ) : (
                      <span className="text-red-500 mr-2">✗</span>
                    )}
                    {f.text}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleSelect}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  p.disabled 
                    ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {p.disabled ? "Start Free Trial" : "Subscribe Now"}
              </button>

              {p.note && (
                <p className="text-center text-blue-500 text-sm mt-4">
                  {p.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}