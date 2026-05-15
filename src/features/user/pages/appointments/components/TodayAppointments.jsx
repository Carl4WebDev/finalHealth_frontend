import { useState, useEffect } from "react";

import { useAppointments } from "../../../context/appointments/useAppointments";
import { useQueues } from "../../../context/queues/useQueues";

import StatusBadge from "./StatusBadge";

import ViewPatientModal from "../modals/ViewPatientModal";
import CancelAppointmentModal from "../modals/CancelAppointmentModal";
import AddVitalsModal from "../modals/AddVitalsModal";

import ConsultationMedicalRecordModal from "../modals/ConsultationMedicalRecordModal";
import PreEmploymentMedicalRecordModal from "../modals/PreEmploymentMedicalRecordModal";

export default function TodayAppointments({ data }) {
  const { loading, error, cancelAppointment, getAllAppointments } =
    useAppointments();

  const {
    addQueue,
    loading: loadingQueues,
    normalQueues,
    priorityQueues,
  } = useQueues();

  const [queueSuccessOpen, setQueueSuccessOpen] = useState(false);
  const [queueErrorOpen, setQueueErrorOpen] = useState(false);
  const [queueErrorMessage, setQueueErrorMessage] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [queuedAppointmentForVitals, setQueuedAppointmentForVitals] =
    useState(null);

  const [showView, setShowView] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showAddVitals, setShowAddVitals] = useState(false);

  const [showConsultationModal, setShowConsultationModal] = useState(false);

const [showPreEmploymentModal, setShowPreEmploymentModal] =
  useState(false);

  const [visibleAppointments, setVisibleAppointments] = useState(data);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    setVisibleAppointments(data);
  }, [data]);

  const refreshAppointments = () => {
    const doctorId = localStorage.getItem("selectedDoctorId");
    const clinicId = localStorage.getItem("selectedClinicId");

    if (doctorId && clinicId) {
      getAllAppointments(Number(doctorId), Number(clinicId));
    }
  };

  const handleCancelConfirm = async (reason) => {
    await cancelAppointment(selectedAppointment.appointment_id, reason);
    refreshAppointments();
    setShowCancel(false);
    setSelectedAppointment(null);
  };

  const handleQueueOnly = async (appointment) => {
    try {
      setSelectedAppointment(appointment);

      const queueData = {
        patientId: appointment.patient_id,
        doctorId: appointment.doctor_id,
        clinicId: appointment.clinic_id,
        priorityId: appointment.priority_id,
        status: "waiting",
      };

      const success = await addQueue(queueData);

      if (success) {
        setQueueSuccessOpen(true);
        setQueuedAppointmentForVitals(appointment);
        setShowAddVitals(true);

        setVisibleAppointments((prev) =>
          prev.filter((a) => a.appointment_id !== appointment.appointment_id)
        );
      } else {
        setQueueErrorMessage("Failed to add patient to queue.");
        setQueueErrorOpen(true);
      }
    } catch (err) {
      setQueueErrorMessage(
        err?.message || "Something went wrong while adding patient to queue."
      );
      setQueueErrorOpen(true);
    }
  };

  const closeVitalsModal = () => {
    setShowAddVitals(false);
    setQueuedAppointmentForVitals(null);
  };

  if (loading) {
    return (
      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <p className="text-sm text-gray-500">Loading today’s appointments…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <h3 className="mb-3 font-semibold text-blue-700">
          Today’s Appointments
        </h3>
        <p className="text-sm text-gray-500">
          No appointments scheduled for today.
        </p>
      </div>
    );
  }

  const queuedPatientIds = [...normalQueues, ...priorityQueues].map(
    (q) => q.patientId
  );

  const filteredAppointments = visibleAppointments.filter(
    (a) => !queuedPatientIds.includes(a.patient_id)
  );

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow">
      <ViewPatientModal
        isOpen={showView}
        appointment={selectedAppointment}
        onClose={() => {
          setShowView(false);
          setSelectedAppointment(null);
        }}
      />

      <CancelAppointmentModal
        isOpen={showCancel}
        appointment={selectedAppointment}
        onClose={() => {
          setShowCancel(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleCancelConfirm}
      />

<AddVitalsModal
  isOpen={showAddVitals}
  onClose={closeVitalsModal}
  patient={queuedAppointmentForVitals}
  appointmentId={queuedAppointmentForVitals?.appointment_id || ""}
  onSuccess={() => {
    const appointmentType =
      queuedAppointmentForVitals?.appointment_type
        ?.toLowerCase()
        ?.trim();

    setShowAddVitals(false);

    if (
      appointmentType === "pre-employment" ||
      appointmentType === "pre employment"
    ) {
      setShowPreEmploymentModal(true);
      return;
    }

    if (appointmentType === "consultation") {
      setShowConsultationModal(true);
      return;
    }

    setQueuedAppointmentForVitals(null);
  }}
/>

<ConsultationMedicalRecordModal
  isOpen={showConsultationModal}
  appointment={queuedAppointmentForVitals}
  onClose={() => {
    setShowConsultationModal(false);
    setQueuedAppointmentForVitals(null);
  }}
/>

<PreEmploymentMedicalRecordModal
  isOpen={showPreEmploymentModal}
  appointment={queuedAppointmentForVitals}
  onClose={() => {
    setShowPreEmploymentModal(false);
    setQueuedAppointmentForVitals(null);
  }}
/>

      {queueSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-blue-50/60 backdrop-blur-sm"
            onClick={() => setQueueSuccessOpen(false)}
          />

          <div className="relative z-10 w-full max-w-sm rounded-2xl border-4 border-blue-600 bg-white p-6 shadow-xl">
            <button
              onClick={() => setQueueSuccessOpen(false)}
              className="absolute right-3 top-3 text-xl font-bold text-blue-600 hover:text-blue-800"
            >
              ×
            </button>

            <h2 className="mb-3 text-center text-lg font-semibold text-blue-700">
              Successfully Added
            </h2>

            <p className="mb-6 text-center text-sm text-gray-600">
              The appointment has been successfully added to the queue.
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setQueueSuccessOpen(false)}
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {queueErrorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-red-50/60 backdrop-blur-sm"
            onClick={() => setQueueErrorOpen(false)}
          />

          <div className="relative z-10 w-full max-w-sm rounded-2xl border-4 border-red-500 bg-white p-6 shadow-xl">
            <button
              onClick={() => setQueueErrorOpen(false)}
              className="absolute right-3 top-3 text-xl font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>

            <h2 className="mb-3 text-center text-lg font-semibold text-red-600">
              Queue Error
            </h2>

            <p className="mb-6 text-center text-sm text-gray-600">
              {queueErrorMessage || "Failed to add patient to queue."}
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setQueueErrorOpen(false)}
                className="rounded-lg bg-red-500 px-6 py-2 font-medium text-white transition hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className="mb-3 font-semibold text-blue-700">Today’s Appointments</h3>

      <div className="max-h-[500px] w-full overflow-x-auto overflow-y-auto">
        <table className="min-w-[1100px] w-full border text-sm">
          <thead className="sticky top-0 z-10 bg-blue-600 text-white">
            <tr>
              <th className="whitespace-nowrap p-2 text-left">Patient</th>
              <th className="whitespace-nowrap p-2 text-left">Date</th>
              <th className="whitespace-nowrap p-2 text-left">Type</th>
              <th className="whitespace-nowrap p-2 text-left">Priority</th>
              <th className="whitespace-nowrap p-2 text-left">Status</th>
              <th className="whitespace-nowrap p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((a) => (
              <tr key={a.appointment_id} className="border-t hover:bg-blue-50">
                <td className="whitespace-nowrap p-2">
                  {`${a.patient_f_name} ${a.patient_m_name || ""} ${a.patient_l_name}`}
                </td>

                <td className="whitespace-nowrap p-2">{a.appointment_date}</td>
                <td className="whitespace-nowrap p-2">{a.appointment_type}</td>
                <td className="whitespace-nowrap p-2">{a.priority_type}</td>

                <td className="whitespace-nowrap p-2">
                  <StatusBadge status={a.status} />
                </td>

                <td className="whitespace-nowrap p-2">
                  <div className="flex gap-2">
                    <button
                      className="rounded bg-blue-600 px-2 py-1 text-xs text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => handleQueueOnly(a)}
                      disabled={loadingQueues}
                    >
                      {loadingQueues ? "Adding..." : "Add to Queue"}
                    </button>

                    <button
                      className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
                      onClick={() => {
                        setSelectedAppointment(a);
                        setShowView(true);
                      }}
                    >
                      View
                    </button>

                    <button
                      className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
                      onClick={() => {
                        setSelectedAppointment(a);
                        setShowCancel(true);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded border border-blue-600 px-3 py-1 text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`rounded border px-3 py-1 ${
                  currentPage === i + 1
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-blue-600 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="rounded border border-blue-600 px-3 py-1 text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}