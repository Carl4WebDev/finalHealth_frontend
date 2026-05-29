import { useState, useEffect } from "react";
import RegisterPatientModal from "./RegisterPatientModal";

import { usePatients } from "../../../context/patients/usePatients";
import { useDoctorSessions } from "../../../context/doctor-sessions/useDoctorSessions";
import { useAppointments } from "../../../context/appointments/useAppointments";
import { apiRequest } from "../../../../../api/httpClient/httpClient";

export default function AddAppointmentModal({
  isOpen,
  onClose,
  doctor,
  clinic,
}) {
  const { patients, loading, error, getPatientOfDoctorInClinic } =
    usePatients();

  const {
    doctorSessions,
    loading: scheduleLoading,
    error: scheduleError,
    getDoctorScheduleInClinic,
  } = useDoctorSessions();

  const {
    createAppointment,
    loading: appointmentLoading,
    error: appointmentError,
  } = useAppointments();

  // ✅ hooks ALWAYS at top
  const [selectedSession, setSelectedSession] = useState(null);
  const [appointmentType, setAppointmentType] = useState("Consultation");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showRegisterPatient, setShowRegisterPatient] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [offScheduleDate, setOffScheduleDate] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    if (!doctor?.doctor_id || !clinic?.clinic_id) return;

    const loadPatients = async () => {
      await getPatientOfDoctorInClinic(doctor.doctor_id, clinic.clinic_id);
    };

    loadPatients();
  }, [isOpen, doctor?.doctor_id, clinic?.clinic_id]);

  useEffect(() => {
    if (!isOpen) return;
    if (!doctor?.doctor_id || !clinic?.clinic_id) return;

    const loadSchedules = async () => {
      await getDoctorScheduleInClinic(doctor.doctor_id, clinic.clinic_id);
    };

    loadSchedules();
  }, [isOpen, doctor?.doctor_id, clinic?.clinic_id]);

  const getDateBorderClass = (dateStr) => {
    const day = new Date(dateStr).getDate();

    const colors = [
      "border-l-blue-400",
      "border-l-green-400",
      "border-l-purple-400",
      "border-l-yellow-400",
      "border-l-pink-400",
      "border-l-indigo-400",
    ];

    return colors[day % colors.length];
  };

  const handleSaveAppointment = async () => {
    if (!selectedPatientId || !selectedSession) {
      console.warn("Missing patient or session");
      return;
    }

    setSaving(true);
    setSaveError(null);

    const selectedPatient = patients.find(
      (p) => p.patient_id === selectedPatientId
    );

    const localDate = new Date(selectedSession.session_date);
    const appointmentDate = localDate.toLocaleDateString("en-CA"); // YYYY-MM-DD

    const payload = {
      patientId: selectedPatientId,
      doctorId: doctor.doctor_id,
      clinicId: clinic.clinic_id,
      appointmentDate,
      appointmentType,
      priorityId: selectedPatient?.priority_id ?? null,
    };

    console.table(payload); // keep for verification
    await createAppointment(payload);
    setSaving(false);
    onClose(); // close modal on success
  };

  const handleSaveAndFill = async () => {
    if (!selectedPatientId || !offScheduleDate) return;

    setSaving(true);
    setSaveError(null);

    const selectedPatient = patients.find(
      (p) => p.patient_id === selectedPatientId
    );

    const payload = {
      patientId: selectedPatientId,
      doctorId: doctor.doctor_id,
      clinicId: clinic.clinic_id,
      appointmentDate: offScheduleDate,
      appointmentType,
      priorityId: selectedPatient?.priority_id ?? null,
    };

    const res = await apiRequest("/api/appointment-routes", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const created = res.data.appointment;
      const detail = {
        appointment_id: created.appointmentId,
        patient_id: created.patientId,
        doctor_id: created.doctorId,
        clinic_id: created.clinicId,
        appointment_date: created.appointmentDate,
        appointment_type: created.appointmentType,
        priority_id: created.priorityId,
        status: created.status,
        patient_f_name: selectedPatient?.full_name?.split(" ")[0] || "",
        patient_m_name: selectedPatient?.full_name?.split(" ")[1] || "",
        patient_l_name: selectedPatient?.full_name?.split(" ").slice(2).join(" ") || "",
      };
      window.dispatchEvent(
        new CustomEvent("offScheduleAppointmentCreated", { detail })
      );
      onClose();
    } else {
      setSaveError(res.message || "Failed to create appointment.");
    }

    setSaving(false);
  };

  if (!isOpen) return null;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Network Error...</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-x-auto overflow-y-auto">


      <RegisterPatientModal
        isOpen={showRegisterPatient}
        onClose={() => setShowRegisterPatient(false)}
      />

      {/* Backdrop */}
  <div
    className="absolute inset-0 bg-blue-50/60 backdrop-blur-sm"
    onClick={onClose}
  />

      {/* Modal */}
<div className="relative bg-white w-full max-w-lg mx-4 rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto overflow-x-auto">

        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Create Appointment
        </h2>

        {/* Doctor & Clinic */}
        <div className="mb-4 text-sm">
          <p>
            <span className="font-medium">Doctor:</span> {doctor.f_name}
          </p>
          <p>
            <span className="font-medium">Clinic:</span> {clinic.clinic_name}
          </p>
        </div>

        {/* Patient Selection */}
        <div className="mb-4">
          <label className="block font-medium mb-2">
            Select Existing Patient
          </label>

          {patients.length === 0 ? (
            <p className="text-sm text-gray-500">
              No previous patients for this doctor and clinic.
            </p>
          ) : (
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={selectedPatientId || ""}
              onChange={(e) => setSelectedPatientId(Number(e.target.value))}
            >
              <option value="">Select patient</option>

              {patients.map((p) => (
                <option key={p.patient_id} value={p.patient_id}>
                  {p.full_name} — Last visit: {p.last_visit} -{" "}
                  {p.priority_level}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Schedule */}
        <div className="mb-4">
          <p className="font-medium mb-2">Select Schedule</p>

          {scheduleLoading && (
            <p className="text-sm text-gray-500">Loading schedules...</p>
          )}

          {scheduleError && (
            <p className="text-sm text-red-500">{scheduleError}</p>
          )}

          {!scheduleLoading &&
            !scheduleError &&
            doctorSessions.length === 0 && (
              <p className="text-sm text-gray-500">
                No available schedules for this doctor and clinic.
              </p>
            )}

          <div className="space-y-2">
            {doctorSessions.map((s) => (
              <button
                key={`${s.session_id}-${s.session_date}`}
                onClick={() => setSelectedSession(s)}
                className={`w-full border border-l-4 rounded-lg px-3 py-2 text-left bg-white
                  ${getDateBorderClass(s.session_date)}
                  ${
                    selectedSession?.session_id === s.session_id &&
                    selectedSession?.session_date === s.session_date
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    {new Date(s.session_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  <span className="text-sm font-bold text-gray-600">
                    {s.start_time} – {s.end_time} <span className="font-extrabold">({s.session_period})</span> 
                  </span>

                  <span className="text-xs text-gray-500">
                    Queue: {s.queue_count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Appointment Type */}
        <div className="mb-4">
          <label className="block font-medium mb-1">
            Appointment Type
          </label>

          <input
            type="text"
            list="appointment-types"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
            placeholder="Select or type appointment type"
          />

          <datalist id="appointment-types">
            <option value="Consultation" label="Consultation"/>
            <option value="Pre-employment" />
            <option value="Follow-up" />
          </datalist>
        </div>

        {/* Off-Schedule Date */}
        <div className="mb-4 rounded-lg border border-dashed border-gray-300 p-3">
          <label className="block font-medium mb-1 text-sm text-gray-700">
            No schedule? Pick a date manually
          </label>
          <input
            type="date"
            value={offScheduleDate}
            onChange={(e) => setOffScheduleDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>


        {/* Patient */}
        <button
          type="button"
          className="text-blue-600 text-sm underline"
          onClick={() => setShowRegisterPatient(true)}
        >
          New Patient? Register new patient
        </button>

        {/* Actions */}
        {saveError && <p className="text-sm text-red-500 mb-2">{saveError}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            disabled={!selectedSession || saving}
            onClick={handleSaveAppointment}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-blue-300"
          >
            {saving ? "Saving..." : "Save Appointment"}
          </button>
          <button
            disabled={!selectedPatientId || !offScheduleDate || saving}
            onClick={handleSaveAndFill}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:bg-green-300"
          >
            {saving ? "Saving..." : "Save & Fill Record"}
          </button>
        </div>
      </div>
    </div>
  );
}
