import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Layout from "../../../components/Layout";

import { useMedicalRecords } from "../../../context/medical-records/useMedicalRecords.js";

import EditPatientModal from "../modal/EditPatientModal.jsx";
import AddMedicalRecordModal from "../modal/AddMedicalRecordModal.jsx";
import AddPreEmploymentModal from "../modal/AddPreEmploymentModal.jsx";

export default function PatientInfo() {
  function formatCurrency(value) {
  if (!value) return "₱0.00";

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(value));
}
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [showEdit, setShowEdit] = useState(false);
  const [showAddMedicalRecords, setShowAddMedicalRecords] = useState(false);
  
  const [isPreEmploymentOpen, setIsPreEmploymentOpen] = useState(false);

  const {
    patientsInfo,
    getPatientInfo,
    getPatientMedRecord,
    patientMedRecords,
    loading,
  } = useMedicalRecords();

  useEffect(() => {
    getPatientMedRecord(patientId);
  }, []);

  useEffect(() => {
    getPatientInfo(patientId);
  }, []); // SAFE: runs once

  const computeAge = (dob) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Layout>
      <AddPreEmploymentModal
  isOpen={isPreEmploymentOpen}
  onClose={() => setIsPreEmploymentOpen(false)}
  patientId={patientId}
/>
<EditPatientModal
  isOpen={showEdit}
  onClose={() => setShowEdit(false)}
  patientId={patientId}
  patient={patientsInfo}
/>

      <AddMedicalRecordModal
        isOpen={showAddMedicalRecords}
        onClose={() => setShowAddMedicalRecords(false)}
        patientId={patientId}
      />

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          ← Back
        </button>

        <h2 className="text-xl font-semibold">Patient Information</h2>

        <div className="flex gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setShowEdit(true)}
          >
            Edit Info
          </button>
        </div>

        {/* Patient Details */}
        {loading || !patientsInfo ? (
          <div className="bg-white p-4 rounded shadow">Loading...</div>
        ) : (
          <div className="bg-white rounded shadow p-4 grid grid-cols-2 gap-4">
            <p>
              <b>Name:</b> {patientsInfo.full_name}
            </p>
            <p>
              <b>Gender:</b> {patientsInfo.gender}
            </p>
            <p>
              <b>Age:</b> {computeAge(patientsInfo.date_of_birth)}
            </p>
            <p>
              <b>Contact:</b> {patientsInfo.contact_number}
            </p>
            <p>
              <b>Backup Contact:</b> {patientsInfo.backup_contact}
            </p>
            <p>
              <b>Email:</b> {patientsInfo.email}
            </p>
            <p>
              <b>Priority:</b>{" "}
              <span className="px-2 py-1 text-xs rounded bg-gray-100">
                {patientsInfo.priority_level}
              </span>
            </p>
            <p className="col-span-2">
              <b>Address:</b> {patientsInfo.address}
            </p>
          </div>
        )}

        {/* Medical History */}
        <h3 className="font-semibold text-lg">Medical History</h3>
        <div className="space-x-3">

                  <button
                    className="px-4 py-1 text-sm bg-blue-600 text-white rounded"
                    onClick={() => setShowAddMedicalRecords(true)}
                  >
                    Add Medical Record
                  </button>

                  <button
            onClick={() => setIsPreEmploymentOpen(true)}
                    className="px-4 py-1 text-sm bg-blue-600 text-white rounded"
          >
            Add Pre-Employment
          </button>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
<table className="w-full">
  <thead className="bg-blue-600 text-white">
    <tr>
      <th className="p-3 text-left">Date</th>
      <th className="p-3 text-left">Diagnosis</th>
      <th className="p-3 text-left">Treatment</th>
      <th className="p-3 text-left">Form Type</th>
      <th className="p-3 text-left">Total Amount</th>
    </tr>
  </thead>

  <tbody>
    {patientMedRecords.map((r) => (
      <tr
        key={r.record_id}
        className="hover:bg-gray-100 cursor-pointer"
        onClick={() =>
          navigate(
            `/user/patients/${patientId}/records/${r.record_id}`,
          )
        }
      >
        {/* DATE */}
        <td className="p-3">
          {r.record_date
            ? new Date(r.record_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""}
        </td>

        {/* DIAGNOSIS */}
        <td className="p-3">{r.diagnosis || "-"}</td>

        {/* TREATMENT */}
        <td className="p-3">{r.treatment || "-"}</td>

        {/* FORM TYPE */}
        <td className="p-3">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              r.form_type === "pre_employment"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {r.form_type
              ? r.form_type
                  .replaceAll("_", " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())
              : "General"}
          </span>
        </td>

        {/* TOTAL AMOUNT */}
        <td className="p-3 font-medium">
          {formatCurrency(r.total_amount)}
        </td>
      </tr>
    ))}
  </tbody>
</table>
        </div>
      </div>
    </Layout>
  );
}
