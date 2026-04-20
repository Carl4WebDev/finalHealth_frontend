import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

import { useMedicalRecords } from "../../context/medical-records/useMedicalRecords";
import { useClinics } from "../../context/clinics/useClinics";
import { useDoctors } from "../../context/doctors/useDoctors";

export default function Patients() {
  const navigate = useNavigate();

  const {
    patients,
    getPatientOfDoctorInClinic,
    loading,
    error,
    clearPatients,
  } = useMedicalRecords();
  const { clinics, getAllClinicsOfDoctor } = useClinics();
  const { approvedDoctors, getAllApprovedDoctorsOfUser } = useDoctors();

  const [doctorId, setDoctorId] = useState(
    localStorage.getItem("selectedDoctorIdPatientPage") || ""
  );
  const [clinicId, setClinicId] = useState(
    localStorage.getItem("selectedClinicIdPatientPage") || ""
  );
  const [search, setSearch] = useState("");

  /* ---------------- LOAD DOCTORS (ONCE) ---------------- */

  useEffect(() => {
    getAllApprovedDoctorsOfUser();
  }, []); // SAFE: runs once

  /* ---------------- LOAD CLINICS (WHEN DOCTOR CHANGES) ---------------- */

  useEffect(() => {
    if (!doctorId) return;

    getAllClinicsOfDoctor(doctorId);
  }, [doctorId]); // SAFE: primitive dependency only

  /* ---------------- LOAD PATIENTS (WHEN BOTH CHANGE) ---------------- */

  useEffect(() => {
    if (!doctorId || !clinicId) return;

    getPatientOfDoctorInClinic(doctorId, clinicId);
  }, [doctorId, clinicId]); // SAFE: primitive dependencies only

  /* ---------------- HANDLERS ---------------- */

  const handleDoctorChange = (id) => {
    setDoctorId(id);
    setClinicId("");

    clearPatients(); // 🔥 REQUIRED

    if (id) {
      localStorage.setItem("selectedDoctorIdPatientPage", id);
    } else {
      localStorage.removeItem("selectedDoctorIdPatientPage");
    }

    localStorage.removeItem("selectedClinicIdPatientPage");
  };

  const handleClinicChange = (id) => {
    setClinicId(id);

    if (!id) {
      clearPatients(); // 🔥 REQUIRED
      localStorage.removeItem("selectedClinicIdPatientPage");
    } else {
      localStorage.setItem("selectedClinicIdPatientPage", id);
    }
  };

  /* ---------------- SEARCH ---------------- */

  const filteredPatients = useMemo(() => {
    if (!search) return patients;

    const keyword = search.toLowerCase();
    return patients.filter((p) => p.full_name.toLowerCase().includes(keyword));
  }, [patients, search]);

  /* ---------------- UI ---------------- */

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
<div className="flex items-center justify-between">
  <h2 className="text-xl font-semibold">Patient Records</h2>

  <button
    onClick={() =>
      navigate("/user/patients/management")
    }
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
  >
    Manage Diagnosis & Treatment
  </button>
</div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <select
            className="border px-3 py-2 rounded"
            value={doctorId}
            onChange={(e) => handleDoctorChange(e.target.value)}
          >
            <option value="">Select Doctor</option>
            {approvedDoctors.map((d) => (
              <option key={d.doctor_id} value={d.doctor_id}>
                Dr. {d.f_name} {d.l_name}
              </option>
            ))}
          </select>

          <select
            className="border px-3 py-2 rounded"
            value={clinicId}
            disabled={!doctorId}
            onChange={(e) => handleClinicChange(e.target.value)}
          >
            <option value="">Select Clinic</option>
            {clinics.map((c) => (
              <option key={c.clinic_id} value={c.clinic_id}>
                {c.clinic_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search patient name..."
            className="border px-3 py-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Gender</th>
                <th className="p-3 text-left">Age</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No patients found
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr
                    key={p.patient_id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/user/patients/${p.patient_id}`)}
                  >
                    <td className="p-3 font-medium">{p.full_name}</td>
                    <td className="p-3">{p.gender}</td>
                    <td className="p-3">{p.age}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {error && <p className="text-sm text-red-600">Error: {error}</p>}
      </div>
    </Layout>
  );
}
