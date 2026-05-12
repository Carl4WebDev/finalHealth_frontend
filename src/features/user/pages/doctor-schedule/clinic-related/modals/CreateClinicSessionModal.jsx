import { useState, useEffect} from "react";
import { useClinics } from "../../../../context/clinics/useClinics";
import { useDoctors } from "../../../../context/doctors/useDoctors";
import { useDoctorSessions } from "../../../../context/doctor-sessions/useDoctorSessions";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function CreateClinicSessionModal({
  isOpen,
  onClose,
  clinicId,
}) {
  const { createClinicSession, getClinicSessions } = useClinics();

  const {
  clinicDoctors,
  getDoctorsByClinic,
} = useDoctors();

const { createDoctorSession } = useDoctorSessions();



const [selectedDoctorId, setSelectedDoctorId] = useState("");

useEffect(() => {
  if (clinicId) {
    getDoctorsByClinic(clinicId);
  }
}, []);

  const [sessions, setSessions] = useState(
    DAYS.map((day) => ({
      day_of_week: day,
      open_time: "",
      close_time: "",
      selected: false,
    }))
  );

  const [applyAll, setApplyAll] = useState(false);

  if (!isOpen) return null;

  const handleDayToggle = (index) => {
    setSessions((prev) =>
      prev.map((session, i) =>
        i === index
          ? { ...session, selected: !session.selected }
          : session
      )
    );
  };

  const handleTimeChange = (index, field, value) => {
    setSessions((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      if (applyAll && (field === "open_time" || field === "close_time")) {
        updated.forEach((session, i) => {
          if (session.selected) {
            updated[i][field] = value;
          }
        });
      }

      return updated;
    });
  };

  const handleSubmit = async () => {
    const validSessions = sessions.filter(
      (s) => s.selected && s.open_time && s.close_time
    );

    for (const session of validSessions) {
      await createClinicSession(clinicId, {
        day_of_week: session.day_of_week,
        open_time: session.open_time,
        close_time: session.close_time,
      });

      await createDoctorSession({
  doctorId: selectedDoctorId,
  clinicId,
  dayOfWeek: session.day_of_week,
  startTime: session.open_time,
  endTime: session.close_time,
});
    }

    await getClinicSessions(clinicId);
    onClose();
  };

  const selectedSessions = sessions.filter((s) => s.selected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-blue-50/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="
          relative bg-white
          w-full max-w-4xl
          rounded-2xl
          border-4 border-blue-600
          shadow-xl
          z-10
          max-h-[95vh]
          overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-blue-700">
              Add Clinic Sessions
            </h3>
            <button
              className="text-blue-600 hover:text-blue-800 text-xl font-bold"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <div className="mb-6">
  <label className="block text-sm font-semibold text-blue-700 mb-2">
    Select Doctor
  </label>

  <select
    value={selectedDoctorId}
    onChange={(e) => setSelectedDoctorId(e.target.value)}
    className="w-full border border-blue-200 rounded-lg px-3 py-2"
  >
    <option value="">Select doctor</option>

    {clinicDoctors.map((doctor) => (
      <option
        key={doctor.doctorId}
        value={doctor.doctorId}
      >
        Dr. {doctor.fName} {doctor.lName}
      </option>
    ))}
  </select>
</div>

          {/* Days Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-blue-700 mb-3">
              Select Available Days
            </label>

            <div className="flex flex-wrap gap-3">
              {sessions.map((session, index) => (
                <button
                  key={session.day_of_week}
                  type="button"
                  onClick={() => handleDayToggle(index)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                    session.selected
                      ? "bg-blue-600 text-white border-blue-600 shadow"
                      : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  {session.day_of_week}
                </button>
              ))}
            </div>
          </div>

          {/* Apply All */}
          {selectedSessions.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                checked={applyAll}
                onChange={() => setApplyAll(!applyAll)}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-blue-700">
                Apply selected time to all chosen days
              </label>
            </div>
          )}

          {/* Selected Days Time Inputs */}
          {selectedSessions.length > 0 ? (
            <div className="space-y-4">
              {selectedSessions.map((session) => {
                const originalIndex = sessions.findIndex(
                  (s) => s.day_of_week === session.day_of_week
                );

                return (
                  <div
                    key={session.day_of_week}
                    className="border border-blue-200 rounded-xl p-4 bg-blue-50/40"
                  >
                    <h4 className="font-semibold text-blue-700 mb-3">
                      {session.day_of_week}
                    </h4>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">
                          Open Time
                        </label>
                        <input
                          type="time"
                          value={session.open_time}
                          onChange={(e) =>
                            handleTimeChange(
                              originalIndex,
                              "open_time",
                              e.target.value
                            )
                          }
                          className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">
                          Close Time
                        </label>
                        <input
                          type="time"
                          value={session.close_time}
                          onChange={(e) =>
                            handleTimeChange(
                              originalIndex,
                              "close_time",
                              e.target.value
                            )
                          }
                          className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-dashed border-blue-200 rounded-xl p-6 text-center text-sm text-gray-500">
              Click the days above to set clinic session schedules.
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Save Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}