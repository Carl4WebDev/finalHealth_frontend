import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Layout from "../../../components/Layout";
import { useMedicalRecords } from "../../../context/medical-records/useMedicalRecords.js";


import { usePatients } from "../../../context/patients/usePatients.js";

import EditPatientModal from "../modal/EditPatientModal.jsx";
import AddPreEmploymentModal from "../modal/AddPreEmploymentModal.jsx";



const DIAGNOSIS_OPTIONS = [
  "Upper Respiratory Infection",
  "Hypertension",
  "Gastritis",
  "Diabetes",
];

const TREATMENT_OPTIONS = [
  "Medication Only",
  "Lifestyle Modification",
  "Hydration Therapy",
  "Further Testing Required",
];

export default function PatientInfo() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [showEdit, setShowEdit] = useState(false);
  const [isPreEmploymentOpen, setIsPreEmploymentOpen] = useState(false);

const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [filterStatus, setFilterStatus] = useState("");

  const [diagnosisList, setDiagnosisList] = useState([]);
const [treatmentList, setTreatmentList] = useState([]);

const [selectedDiagnosis, setSelectedDiagnosis] = useState("");
const [selectedTreatment, setSelectedTreatment] = useState("");
const sanitizeVisitField = (value) => {
  if (!value) return "-";

  // already array
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }

  // plain string
  const raw = String(value).trim();

  // try real JSON first
  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean).join(", ");
    }

    if (typeof parsed === "string") {
      return parsed;
    }
  } catch {
    // ignore and continue
  }

  // fallback for strings like:
  // {"Upper Respiratory Infection","Hypertension","Gastritis"}
  if (raw.startsWith("{") && raw.endsWith("}")) {
    return raw
      .slice(1, -1)
      .split(",")
      .map((item) => item.replace(/^"+|"+$/g, "").trim())
      .filter(Boolean)
      .join(", ");
  }

  // remove extra quotes if single value only
  return raw.replace(/^"+|"+$/g, "").trim() || "-";
};

  const {
    patientsInfo,
    getPatientInfo,
    patientVisitHistory,
    getPatientVisitHistory,
    loadingPatientInfo,
    loadingPatientVisitHistory,
  } = useMedicalRecords();

  useEffect(() => {
    getPatientInfo(patientId);
  }, [patientId]);

  useEffect(() => {
    getPatientVisitHistory(patientId);
  }, [patientId]);

  const computeAge = (dob) => {
    if (!dob) return "-";

    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(Number(value || 0));
  };

  const renderStatusBadge = (status) => {
    const baseClass =
      "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold";

    const statusClass =
      status === "Completed"
        ? "bg-green-100 text-green-700"
        : status === "Scheduled"
          ? "bg-blue-100 text-blue-700"
          : status === "Cancelled"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700";

    return <span className={`${baseClass} ${statusClass}`}>{status}</span>;
  };

  const renderFormTypeBadge = (formType) => {
    const baseClass =
      "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold";

    const normalized = (formType || "").toLowerCase();

    const formClass =
      normalized === "pre-employment" || normalized === "pre_employment"
        ? "bg-purple-100 text-purple-700"
        : normalized === "follow-up" || normalized === "follow_up"
          ? "bg-amber-100 text-amber-700"
          : "bg-blue-100 text-blue-700";

    return <span className={`${baseClass} ${formClass}`}>{formType || "General"}</span>;
  };

  const openVisitHistory = (visitId) => {
    navigate(`visit-history/${visitId}`);
  };

  const addDiagnosis = () => {
  if (!selectedDiagnosis) return;

  setDiagnosisList((prev) => [
    ...prev,
    { id: Date.now(), value: selectedDiagnosis },
  ]);

  setSelectedDiagnosis("");
};

const removeDiagnosis = (id) => {
  setDiagnosisList((prev) => prev.filter((d) => d.id !== id));
};

const addTreatment = () => {
  if (!selectedTreatment) return;

  setTreatmentList((prev) => [
    ...prev,
    { id: Date.now(), value: selectedTreatment },
  ]);

  setSelectedTreatment("");
};

const removeTreatment = (id) => {
  setTreatmentList((prev) => prev.filter((t) => t.id !== id));
};

const { uploadPatientImage } = usePatients();

const handleUploadPatientImage = async (e, patientId) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const success = await uploadPatientImage(patientId, file);

  if (success) {
    await getPatientInfo(patientId);
  }

  e.target.value = "";
};

const filteredVisitHistory = patientVisitHistory?.filter((visit) => {
  const visitDate = new Date(visit.date);

  const matchesStartDate = startDate
    ? visitDate >= new Date(startDate)
    : true;

  const matchesEndDate = endDate
    ? visitDate <= new Date(endDate + "T23:59:59")
    : true;

  const matchesStatus = filterStatus
    ? visit.status === filterStatus
    : true;

  return matchesStartDate && matchesEndDate && matchesStatus;
});
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

      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
           <Link to={`/user/patients`}>
            <button
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:w-auto"
            >
              ← Back
            </button>
           </Link>

            <h2 className="text-center text-2xl font-bold text-gray-800">
              Patient Information
            </h2>

            <div className="w-full sm:w-auto">
              <button
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                onClick={() => setShowEdit(true)}
              >
                Edit Info
              </button>
            </div>
          </div>

          {loadingPatientInfo || !patientsInfo ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="text-gray-500">Loading patient information...</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-center text-xl font-semibold text-gray-800">
                  Patient Details
                </h3>
                <p className="mt-1 text-center text-sm text-gray-500">
                  Basic patient profile and contact information
                </p>
              </div>

              <div className="mb-8 flex flex-col items-center justify-center">
  {patientsInfo.patient_img_path ? (
    <img
      src={`${import.meta.env.VITE_API_BASE}${patientsInfo.patient_img_path}`}
      alt={patientsInfo.full_name}
className="h-72 w-72 rounded-full border-4 border-white object-cover shadow-2xl"
    />
  ) : (
    <div className="flex h-72 w-72 items-center justify-center rounded-full border-2 border-dashed border-red-300 bg-red-50 text-center text-lg font-semibold text-red-500">
      No Image
    </div>
  )}

  <label className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
    Upload Image
    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => handleUploadPatientImage(e, patientId)}
    />
  </label>
</div>

              <div className="flex flex-wrap justify-center gap-4">
                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-center sm:w-[48%] lg:w-[30%]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {patientsInfo.full_name}
                  </p>
                </div>

                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-center sm:w-[48%] lg:w-[30%]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Gender
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {patientsInfo.gender}
                  </p>
                </div>

                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-center sm:w-[48%] lg:w-[30%]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Age
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {computeAge(patientsInfo.date_of_birth)}
                  </p>
                </div>

                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-center sm:w-[48%] lg:w-[30%]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {patientsInfo.contact_number || "-"}
                  </p>
                </div>

                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-center sm:w-[48%] lg:w-[30%]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Backup Contact
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {patientsInfo.backup_contact || "-"}
                  </p>
                </div>

                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-center sm:w-[48%] lg:w-[30%]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </p>
                  <p className="mt-2 break-words text-sm font-semibold text-gray-800">
                    {patientsInfo.email || "-"}
                  </p>
                </div>

                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-center sm:w-[48%] lg:w-[30%]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Priority
                  </p>
                  <div className="mt-2 flex justify-center">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {patientsInfo.priority_level || "Normal"}
                    </span>
                  </div>
                </div>

                <div className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-center lg:w-[62%]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Address
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {patientsInfo.address || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-semibold text-gray-800">
                  Visit History
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Click any visit record to open the full visit history page
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
<input
  type="date"
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
  className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
  placeholder="Start Date"
/>

<input
  type="date"
  value={endDate}
  onChange={(e) => setEndDate(e.target.value)}
  className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
  placeholder="End Date"
/>

  <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
  >
    <option value="">All Status</option>
    <option value="Scheduled">Scheduled</option>
    <option value="Completed">Completed</option>
    <option value="Cancelled">Cancelled</option>
  </select>

  <button
    type="button"
    onClick={() => {
setStartDate("");
setEndDate("");
      setFilterStatus("");
    }}
    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
  >
    Clear
  </button>
</div>

            </div>

            {loadingPatientVisitHistory ? (
              <div className="mt-6 rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
                Loading visit history...
              </div>
            ) : !patientVisitHistory?.length ? (
              <div className="mt-6 rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
                No visit history found.
              </div>
            ) : (
              <>
                <div className="mt-6 hidden overflow-hidden rounded-2xl border border-gray-200 lg:block">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-4 py-4 text-center text-sm font-semibold">
                          Date
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold">
                          Visit Type
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold">
                          Diagnosis
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold">
                          Treatment
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold">
                          Form Type
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold">
                          Doctor
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold">
                          Clinic
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold">
                          Total Amount
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredVisitHistory.map((visit, index) => (
 <tr
  key={visit.appointmentId}
  onClick={() => {
    if (visit.status === "Cancelled") return;
    openVisitHistory(visit.appointmentId);
  }}
  className={`text-center transition ${
    visit.status === "Cancelled"
      ? "cursor-not-allowed bg-gray-100 opacity-60"
      : "cursor-pointer hover:bg-blue-50"
  } ${
    index !== filteredVisitHistory.length - 1
      ? "border-b border-gray-200"
      : ""
  }`}
>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {formatDate(visit.date)}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-800">
                            {visit.visitType || "-"}
                          </td>
<td className="px-4 py-4 text-sm text-gray-700">
  {sanitizeVisitField(visit.diagnosis)}
</td>
<td className="px-4 py-4 text-sm text-gray-700">
  {sanitizeVisitField(visit.treatment)}
</td>
                          <td className="px-4 py-4 text-sm">
                            <div className="flex justify-center">
                              {renderFormTypeBadge(visit.formType)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {visit.doctor || "-"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {visit.clinic || "-"}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                            {formatCurrency(visit.totalAmount)}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <div className="flex justify-center">
                              {renderStatusBadge(visit.status)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 space-y-4 lg:hidden">
                  {filteredVisitHistory.map((visit) => (
<div
  key={visit.appointmentId}
  onClick={() => {
    if (visit.status === "Cancelled") return;
    openVisitHistory(visit.appointmentId);
  }}
  className={`rounded-2xl border p-5 shadow-sm transition ${
    visit.status === "Cancelled"
      ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-60"
      : "cursor-pointer border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
  }`}
>
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <h4 className="text-base font-bold text-gray-800">
                          {visit.visitType || "-"}
                        </h4>

                        <p className="text-sm text-gray-500">
                          {formatDate(visit.date)}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {renderFormTypeBadge(visit.formType)}
                          {renderStatusBadge(visit.status)}
                        </div>
                      </div>

                      <div className="mt-5 space-y-3 text-center">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Diagnosis
                          </p>
<p className="mt-1 text-sm text-gray-800">
  {sanitizeVisitField(visit.diagnosis)}
</p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Treatment
                          </p>
<p className="mt-1 text-sm text-gray-800">
  {sanitizeVisitField(visit.treatment)}
</p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Doctor
                          </p>
                          <p className="mt-1 text-sm text-gray-800">
                            {visit.doctor || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Clinic
                          </p>
                          <p className="mt-1 text-sm text-gray-800">
                            {visit.clinic || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Total Amount
                          </p>
                          <p className="mt-1 text-sm font-bold text-gray-800">
                            {formatCurrency(visit.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}