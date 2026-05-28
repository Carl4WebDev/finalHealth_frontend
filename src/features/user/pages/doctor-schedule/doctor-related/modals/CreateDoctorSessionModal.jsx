import { useState, useEffect } from "react";

import { useClinics } from "../../../../context/clinics/useClinics";
import { useDoctorSessions } from "../../../../context/doctor-sessions/useDoctorSessions";

export default function CreateDoctorSessionModal({
  isOpen,
  onClose,
  doctorId,
}) {
  const {
    clinics,
    clinicSessions,
    loading,
    getAllClinicsOfDoctor,
    getClinicSessions,
  } = useClinics();

  const { getAllDoctorSessions, createDoctorSession } = useDoctorSessions();

  const [clinicId, setClinicId] = useState("");
  const [selectedSchedules, setSelectedSchedules] = useState([]);

  useEffect(() => {
    if (isOpen) {
      getAllClinicsOfDoctor(Number(doctorId));
    }
  }, [isOpen, doctorId]);

  if (!isOpen) return null;

  /* ================= HANDLERS ================= */

  const handleClinicChange = async (value) => {
    const id = Number(value);
    setClinicId(id);
    setSelectedSchedules([]);
    await getClinicSessions(id);
  };

  const handleSubmit = async () => {
    if (selectedSchedules.length === 0) return;

    for (const schedule of selectedSchedules) {
      const payload = {
        doctorId,
        clinicId,
        dayOfWeek: schedule.day_of_week,
        startTime: schedule.open_time,
        endTime: schedule.close_time,
      };

      await createDoctorSession(payload);
    }

    await getAllDoctorSessions(doctorId);
    onClose();
  };

  const toggleSchedule = (schedule) => {
    const exists = selectedSchedules.some(
      (s) => s.clinic_schedule_id === schedule.clinic_schedule_id
    );

    if (exists) {
      setSelectedSchedules((prev) =>
        prev.filter(
          (s) => s.clinic_schedule_id !== schedule.clinic_schedule_id
        )
      );
    } else {
      setSelectedSchedules((prev) => [...prev, schedule]);
    }
  };

  const handleSelectAll = () => {
    if (selectedSchedules.length === clinicSessions.length) {
      setSelectedSchedules([]);
    } else {
      setSelectedSchedules(clinicSessions);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Blurred Blue Backdrop */}
      <div
        className="absolute inset-0 bg-blue-50/60 backdrop-blur-sm"
        onMouseDown={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white w-full max-w-3xl rounded-2xl border-4 border-blue-600 shadow-xl p-6 z-10 max-h-[90vh] overflow-y-auto overflow-x-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-700">
            Add Doctor Session
          </h2>

          <button
            onClick={onClose}
            className="text-blue-600 hover:text-blue-800 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 text-sm min-w-[650px]">
          {/* Clinic Selector */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Clinic
            </label>
            <select
              value={clinicId}
              onChange={(e) => handleClinicChange(e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select clinic</option>
              {clinics.map((c) => (
                <option key={c.clinic_id} value={c.clinic_id}>
                  {c.clinic_name} — {c.address}
                </option>
              ))}
            </select>
          </div>

          {/* Clinic Sessions */}
          {clinicId && (
            <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium text-blue-700">
                  Clinic Available Sessions
                </p>

                {clinicSessions.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    {selectedSchedules.length === clinicSessions.length
                      ? "Clear All"
                      : "Select All"}
                  </button>
                )}
              </div>

              {loading ? (
                <p className="text-sm text-gray-500">Loading sessions…</p>
              ) : clinicSessions.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No schedules set for this clinic.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-blue-200 min-w-[600px]">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="p-2 text-left">Day</th>
                        <th className="p-2 text-left">Start</th>
                        <th className="p-2 text-left">End</th>
                        <th className="p-2 text-left">Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clinicSessions.map((s) => {
                        const isSelected = selectedSchedules.some(
                          (item) =>
                            item.clinic_schedule_id ===
                            s.clinic_schedule_id
                        );

                        return (
                          <tr
                            key={s.clinic_schedule_id}
                            onClick={() => toggleSchedule(s)}
                            className={`border-t cursor-pointer transition ${
                              isSelected
                                ? "bg-blue-200"
                                : "hover:bg-blue-100"
                            }`}
                          >
                            <td className="p-2">{s.day_of_week}</td>
                            <td className="p-2">{s.open_time}</td>
                            <td className="p-2">{s.close_time}</td>
                            <td className="p-2">{s.session_period}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={selectedSchedules.length === 0}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            Save Sessions
          </button>
        </div>
      </div>
    </div>
  );
}
