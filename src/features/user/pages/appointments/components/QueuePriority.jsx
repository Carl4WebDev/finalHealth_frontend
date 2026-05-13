import { useState } from "react";
import { useQueues } from "../../../context/queues/useQueues";

export default function QueuePriority({ data = [], loading }) {
  const { updateQueueStatus } = useQueues();
  const [showCompleted, setShowCompleted] = useState(false);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading priority queue...</p>;
  }

  if (!data.length) {
    return <p className="text-gray-500 text-sm">No priority patients in queue.</p>;
  }

  const waitingQueue = data.filter(
    (q) => q.status?.toLowerCase() === "waiting"
  );

  const inProgressQueue = data.filter(
    (q) => q.status?.toLowerCase() === "in-progress"
  );

  const completedQueue = data.filter(
    (q) => q.status?.toLowerCase() === "completed"
  );

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === "waiting") {
      return "bg-gray-100 text-gray-700";
    }

    if (normalizedStatus === "in-progress") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (normalizedStatus === "completed") {
      return "bg-green-100 text-green-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  const getPriorityBadge = (priorityLevel) => {
    const normalizedPriority = priorityLevel?.toLowerCase();

    if (normalizedPriority === "emergency") {
      return "bg-red-100 text-red-700";
    }

    if (normalizedPriority === "pwd") {
      return "bg-purple-100 text-purple-700";
    }

    if (normalizedPriority === "senior citizen") {
      return "bg-orange-100 text-orange-700";
    }

    if (normalizedPriority === "follow-up") {
      return "bg-cyan-100 text-cyan-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  const renderQueueCards = (queueList, sectionType) => {
    if (!queueList.length) {
      return (
        <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
          No patients in this section.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {queueList.map((q) => (
          <div
            key={q.queueEntryId}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              {/* Patient Info */}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-gray-800 break-words">
                  {q.patientName}
                </h4>

                <div className="mt-2 flex flex-col gap-1 text-xs text-gray-600 sm:text-sm">
                  <p>
                    <span className="font-medium">Priority:</span>{" "}
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityBadge(
                        q.priorityLevel
                      )}`}
                    >
                      {q.priorityLevel}
                    </span>
                  </p>

                  <p>
                    <span className="font-medium">Arrival Date:</span>{" "}
                    {q.arrivalDate}
                  </p>

                  <p>
                    <span className="font-medium">Arrival Time:</span>{" "}
                    {q.arrivalTime}
                  </p>
                </div>
              </div>

              {/* Status + Actions */}
              <div className="flex w-full flex-col gap-2 md:w-auto md:items-end">
                <span
                  className={`inline-block w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(
                    q.status
                  )}`}
                >
                  {q.status}
                </span>

                <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
                  {sectionType === "waiting" && (
                    <button
className="rounded-xl bg-yellow-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-yellow-600 active:scale-95"
                      onClick={() =>
                        updateQueueStatus(q.queueEntryId, "in-progress")
                      }
                    >
                      In Progress
                    </button>
                  )}

                  {sectionType === "in-progress" && (
                    <button
className="rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-95"                      onClick={() =>
                        updateQueueStatus(q.queueEntryId, "completed")
                      }
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-blue-700 sm:text-lg">
          Queue – Priority
        </h3>

        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
            Waiting: {waitingQueue.length}
          </span>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">
            In Progress: {inProgressQueue.length}
          </span>
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
            Completed: {completedQueue.length}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Waiting */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-800 sm:text-base">
              Waiting
            </h4>
          </div>
          {renderQueueCards(waitingQueue, "waiting")}
        </section>

        {/* In Progress */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-800 sm:text-base">
              In Progress
            </h4>
          </div>
          {renderQueueCards(inProgressQueue, "in-progress")}
        </section>

        {/* Completed */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-gray-800 sm:text-base">
              Completed
            </h4>

            <button
              className="rounded bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
              onClick={() => setShowCompleted((prev) => !prev)}
            >
              {showCompleted ? "Hide" : "Show"}
            </button>
          </div>

          {showCompleted && renderQueueCards(completedQueue, "completed")}
        </section>
      </div>
    </div>
  );
}