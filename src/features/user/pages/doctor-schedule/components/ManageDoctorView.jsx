import React from "react";
import medicalLogo from "../../../../../assets/medical-logo.jpg";

import { assignClinicToDoctor } from "../../../../../api/doctorApi";

const ManageDoctorView = ({
  darkMode,
  doctor,
  unassignedClinics,
  affiliatedClinics,
  sessions,
  onBack,
  onEditClinic,
  onAddSession,
  onEditSession,
  onDeleteClinic,
  onDeleteSession,
}) => {
  const formatTimeForDisplay = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatSessionType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  // NEW: Handle clinic selection for affiliation
  const handleSelectExistingClinic = async (clinicId) => {
    if (!doctor?.id) {
      alert("Doctor ID missing.");
      console.log("Doctor object:", doctor);
      return;
    }

    try {
      const data = await assignClinicToDoctor(doctor.id, clinicId);

      if (!data.success)
        throw new Error(data.error || "Failed to assign clinic");

      alert("Clinic successfully affiliated!");

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          darkMode
            ? "border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400"
            : "border-gray-300 text-blue-600 hover:border-blue-500 hover:text-blue-700"
        }`}
      >
        ← Back to Schedule
      </button>

      {/* Doctor Information */}
      <div
        className={`rounded-xl p-6 shadow-sm border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Doctor Information
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center md:items-start">
          <img
            src={medicalLogo}
            className="w-52 h-52 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center text-3xl"
          />

          <div className="space-y-3">
            <div>
              <div
                className={`text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Name
              </div>
              <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {doctor?.name || "Dr. Arias Reyes"}
              </div>
            </div>

            <div>
              <div
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Specialization
              </div>
              <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {doctor?.specialization || "Internal Medicine"}
              </div>
            </div>

            <div>
              <div
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                License Number
              </div>
              <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {doctor?.license || "PRC-175803"}
              </div>
            </div>

            <div>
              <div
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Experience
              </div>
              <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {doctor?.experience || "15 years"}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Education
              </div>
              <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {doctor?.education || "UST Faculty of Medicine"}
              </div>
            </div>
            <div>
              <div
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Address
              </div>
              <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {doctor?.address || "UST Faculty of Medicine"}
              </div>
            </div>
            <div>
              <div
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Status
              </div>
              <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {doctor?.status || "UST Faculty of Medicine"}
              </div>
            </div>

            <div>
              <div
                className={`text-sm mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Gender
              </div>
              <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {doctor?.gender || "Male"}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ALL CLINICS — choose existing clinic to affiliate */}
      <div
        className={`rounded-xl p-6 shadow-sm border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Link Existing Clinic
          </h3>
        </div>
        {unassignedClinics?.length === 0 ? (
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            No clinics available. Add a new one.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {unassignedClinics.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectExistingClinic(c.id)}
                className={`border rounded-lg p-4 text-left transition hover:shadow-lg ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 hover:bg-gray-600"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }`}
              >
                <div className="font-semibold text-blue-600">
                  {c.name || "N/A"}
                </div>

                <div className="font-semibold text-blue-600">
                  {c.businessPermit || "N/A"}
                </div>

                <div className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  {c.address || "N/A"}
                </div>

                <div className="text-sm mt-1 opacity-70">
                  {c.opening || "N/A"} · {c.days || "N/A"}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Affiliated Clinics */}
      <div
        className={`rounded-xl p-6 shadow-sm border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Affiliated Clinics
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th
                  className={`text-left py-3 px-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Clinic Name
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Address
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Open Hours
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Open Days
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Contact
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Affiliation Code
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {affiliatedClinics.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className={`py-6 text-center text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No affiliated clinics found.
                  </td>
                </tr>
              ) : (
                affiliatedClinics.map((clinic) => (
                  <tr
                    key={clinic.id}
                    className={`border-b ${
                      darkMode ? "border-gray-700" : "border-gray-100"
                    }`}
                  >
                    <td
                      className={`py-3 px-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {clinic.name}
                    </td>
                    <td
                      className={`py-3 px-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {clinic.address}
                    </td>
                    <td
                      className={`py-3 px-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {clinic.openHours}
                    </td>
                    <td
                      className={`py-3 px-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {clinic.openDays}
                    </td>
                    <td
                      className={`py-3 px-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {clinic.contact}
                    </td>
                    <td
                      className={`py-3 px-4 font-mono text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {clinic.affiliation_code || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onEditClinic(clinic)}
                        className="text-blue-600 hover:text-blue-700 mr-3 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteClinic(clinic.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Sessions */}
      <div
        className={`rounded-xl p-6 shadow-sm border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Doctor Sessions
          </h3>
          <button
            onClick={onAddSession}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Add Session
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th
                  className={`text-left py-3 px-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Day
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Clinic
                </th>

                <th
                  className={`text-left py-3 px-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Start Time
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  End Time
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className={`border-b ${
                    darkMode ? "border-gray-700" : "border-gray-100"
                  }`}
                >
                  <td
                    className={`py-3 px-4 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {session.day}
                  </td>
                  <td
                    className={`py-3 px-4 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {session.clinic}
                  </td>

                  <td
                    className={`py-3 px-4 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {formatTimeForDisplay(session.startTime)}
                  </td>
                  <td
                    className={`py-3 px-4 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {formatTimeForDisplay(session.endTime)}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onEditSession(session)}
                      className="text-blue-600 hover:text-blue-700 mr-3 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageDoctorView;
