import React from "react";
import SubscriberDetailsModal from "../modals/SubscriberDetailsModal";

export default function SubscribersTable({
  subscribers,
  selectedSubscribers,
  onSelectAll,
  onSelectSubscriber,
}) {
  const [selectedSubscriber, setSelectedSubscriber] = React.useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);

  const handleRowClick = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsDetailsModalOpen(true);
  };

  const getSubscriptionBadgeClasses = (type) => {
    switch (type) {
      case "Premium":
        return "bg-blue-100 text-blue-800";
      case "Enterprise":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeClasses = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  return (
    <>
      {/* Desktop Table View - hidden on small screens */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#2133ff] text-white">
              <th className="p-3 xl:p-4">
                <input
                  type="checkbox"
                  className="rounded"
                  onChange={onSelectAll}
                  checked={
                    subscribers.length > 0 &&
                    subscribers.every((s) =>
                      selectedSubscribers.includes(s.id)
                    )
                  }
                />
              </th>
              <th className="p-3 xl:p-4 text-sm font-semibold">Name</th>
              <th className="p-3 xl:p-4 text-sm font-semibold">Email</th>
              <th className="p-3 xl:p-4 text-sm font-semibold">
                Subscription Type
              </th>
              <th className="p-3 xl:p-4 text-sm font-semibold">Status</th>
              <th className="p-3 xl:p-4 text-sm font-semibold">Start Date</th>
              <th className="p-3 xl:p-4 text-sm font-semibold">End Date</th>
            </tr>
          </thead>

          <tbody>
            {subscribers.map((subscriber) => (
              <tr
                key={subscriber.id}
                className="border-b hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => handleRowClick(subscriber)}
              >
                <td
                  className="p-3 xl:p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedSubscribers.includes(subscriber.id)}
                    onChange={() => onSelectSubscriber(subscriber.id)}
                  />
                </td>
                <td className="p-3 xl:p-4 font-medium text-sm">
                  {subscriber.name}
                </td>
                <td className="p-3 xl:p-4 text-gray-600 text-sm">
                  {subscriber.email}
                </td>
                <td className="p-3 xl:p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getSubscriptionBadgeClasses(
                      subscriber.subscriptionType
                    )}`}
                  >
                    {subscriber.subscriptionType}
                  </span>
                </td>
                <td className="p-3 xl:p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeClasses(
                      subscriber.status
                    )}`}
                  >
                    {subscriber.status}
                  </span>
                </td>
                <td className="p-3 xl:p-4 text-sm whitespace-nowrap">
                  {subscriber.subscriptionDate}
                </td>
                <td className="p-3 xl:p-4 text-sm whitespace-nowrap">
                  {subscriber.subscriptionEnd}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {subscribers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            No subscribers found
          </div>
        )}
      </div>

      {/* Tablet View - visible on md screens only */}
      <div className="hidden md:block lg:hidden">
        {/* Select All Header */}
        <div className="flex items-center gap-3 p-3 bg-[#2133ff] text-white rounded-t-xl">
          <input
            type="checkbox"
            className="rounded"
            onChange={onSelectAll}
            checked={
              subscribers.length > 0 &&
              subscribers.every((s) => selectedSubscribers.includes(s.id))
            }
          />
          <span className="text-sm font-semibold">
            Select All ({subscribers.length})
          </span>
        </div>

        <div className="divide-y divide-gray-200">
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              onClick={() => handleRowClick(subscriber)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="pt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedSubscribers.includes(subscriber.id)}
                    onChange={() => onSelectSubscriber(subscriber.id)}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {subscriber.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getSubscriptionBadgeClasses(
                          subscriber.subscriptionType
                        )}`}
                      >
                        {subscriber.subscriptionType}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClasses(
                          subscriber.status
                        )}`}
                      >
                        {subscriber.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                    <div>
                      <span className="text-gray-400">Email: </span>
                      <span className="text-gray-600">{subscriber.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Clinic: </span>
                      <span className="text-gray-600">
                        {subscriber.clinicName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Start: </span>
                      <span className="text-gray-600">
                        {subscriber.subscriptionDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">End: </span>
                      <span className="text-gray-600">
                        {subscriber.subscriptionEnd}
                      </span>
                    </div>
                  </div>
                </div>

                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1"
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
              </div>
            </div>
          ))}
        </div>

        {subscribers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            No subscribers found
          </div>
        )}
      </div>

      {/* Mobile Card View - visible on small screens only */}
      <div className="block md:hidden">
        {/* Select All Header */}
        <div className="flex items-center gap-3 p-3 bg-[#2133ff] text-white">
          <input
            type="checkbox"
            className="rounded"
            onChange={onSelectAll}
            checked={
              subscribers.length > 0 &&
              subscribers.every((s) => selectedSubscribers.includes(s.id))
            }
          />
          <span className="text-sm font-semibold">
            Select All ({subscribers.length})
          </span>
        </div>

        <div className="divide-y divide-gray-200">
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 active:bg-gray-100"
              onClick={() => handleRowClick(subscriber)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="pt-0.5 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedSubscribers.includes(subscriber.id)}
                    onChange={() => onSelectSubscriber(subscriber.id)}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name and Badges Row */}
                  <div className="flex flex-col gap-1.5 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {subscriber.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getSubscriptionBadgeClasses(
                          subscriber.subscriptionType
                        )}`}
                      >
                        {subscriber.subscriptionType}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClasses(
                          subscriber.status
                        )}`}
                      >
                        {subscriber.status}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="truncate">{subscriber.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span className="truncate">
                        {subscriber.clinicName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {subscriber.subscriptionDate} →{" "}
                        {subscriber.subscriptionEnd}
                      </span>
                    </div>
                  </div>
                </div>

                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1"
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
              </div>
            </div>
          ))}
        </div>

        {subscribers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            No subscribers found
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedSubscriber && (
        <SubscriberDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          subscriber={selectedSubscriber}
        />
      )}
    </>
  );
}