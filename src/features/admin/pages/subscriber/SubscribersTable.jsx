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

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#2133ff] text-white">
              <th className="p-4">
                <input
                  type="checkbox"
                  className="rounded"
                  onChange={onSelectAll}
                  // Check if all paginated subscribers are in the selected list
                  checked={
                    subscribers.length > 0 &&
                    subscribers.every((s) =>
                      selectedSubscribers.includes(`${s.user_id}-${s.subscription_id}`)
                    )
                  }
                />
              </th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Subscription Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Start Date</th>
              <th className="p-4">End Date</th>
            </tr>
          </thead>

          <tbody>
            {subscribers.map((subscriber) => {
              const rowKey = `${subscriber.user_id}-${subscriber.subscription_id}`;

              const fullName = [
                subscriber.f_name,
                subscriber.m_name,
                subscriber.l_name,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <tr
                  key={rowKey}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => handleRowClick(subscriber)}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedSubscribers.includes(rowKey)}
                      onChange={() => onSelectSubscriber(rowKey)}
                    />
                  </td>

                  <td className="p-4 font-medium">{fullName || "-"}</td>
                  <td className="p-4 text-gray-600">{subscriber.email}</td>
                  <td className="p-4">
                    {subscriber.plan_name ? (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                        {subscriber.plan_name}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="p-4">
                    {subscriber.subscription_status ? (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          subscriber.subscription_status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {subscriber.subscription_status}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="p-4">
                    {subscriber.start_date ? new Date(subscriber.start_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-4">
                    {subscriber.end_date ? new Date(subscriber.end_date).toLocaleDateString() : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {subscribers.length === 0 && (
          <div className="text-center py-12 text-gray-500">No subscribers found</div>
        )}
      </div>

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