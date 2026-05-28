import { useState, useEffect } from "react";
import { useMedicalRecords } from "../../../context/medical-records/useMedicalRecords";

const initialForm = {
  reasonForFollowup: "",
  currentStatus: "",
  currentSymptoms: [],
  medicationCompliance: "",
  medicationNotes: "",
  newComplaints: "",
  secretaryNotes: "",
};

const currentStatusOptions = [
  "Improved",
  "Worsened",
  "Same",
  "New complaints",
];

const medicationComplianceOptions = [
  "Compliant",
  "Partially compliant",
  "Non-compliant",
];

const currentSymptomsOptions = [
  "Fever",
  "Cough",
  "Chest Pain",
  "Shortness of Breath",
  "Headache",
  "Dizziness",
  "Body Weakness",
  "Fatigue",
  "Abdominal Pain",
  "Vomiting",
  "Diarrhea",
  "Joint Pain",
  "Swelling",
  "Skin Rash",
  "Numbness",
  "Vision Changes",
  "Weight Change",
  "Insomnia",
  "Anxiety",
];

export default function FollowupMedicalRecordModal({
  isOpen,
  onClose,
  appointment,
}) {
  const {
    createMedicalRecord,
    loadingCreateMedicalRecord,
    getPatientMedRecord,
    patientMedRecords,
    getMedicalRecordsFullDetails,
    medicalRecordsFullDetails,
  } = useMedicalRecords();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [previousRecord, setPreviousRecord] = useState(null);
  const [previousVitals, setPreviousVitals] = useState(null);

  useEffect(() => {
    if (!isOpen || !appointment?.patient_id) return;

    const fetchPreviousRecord = async () => {
      setLoadingHistory(true);
      setPreviousRecord(null);
      setPreviousVitals(null);

      try {
        await getPatientMedRecord(appointment.patient_id);
      } catch {
        // Silently handle — previous record is optional context
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchPreviousRecord();
  }, [isOpen, appointment?.patient_id]);

  useEffect(() => {
    if (!patientMedRecords || !Array.isArray(patientMedRecords) || patientMedRecords.length === 0) return;

    const sorted = [...patientMedRecords].sort(
      (a, b) => new Date(b.record_date) - new Date(a.record_date)
    );
    const mostRecent = sorted[0];

    if (mostRecent?.record_id) {
      getMedicalRecordsFullDetails(mostRecent.record_id);
    }
  }, [patientMedRecords]);

  useEffect(() => {
    if (!medicalRecordsFullDetails?.medicalRecord) return;

    const rec = medicalRecordsFullDetails.medicalRecord;
    setPreviousRecord(rec);

    if (medicalRecordsFullDetails.vitalSigns?.length > 0) {
      setPreviousVitals(medicalRecordsFullDetails.vitalSigns[0]);
    }
  }, [medicalRecordsFullDetails]);

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setError("");
      setPreviousRecord(null);
      setPreviousVitals(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const patientName = `${appointment?.patient_f_name || ""} ${
    appointment?.patient_m_name || ""
  } ${appointment?.patient_l_name || ""}`.trim();

  const toggleArrayValue = (field, value) => {
    setForm((prev) => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      };
    });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointment?.patient_id || !appointment?.appointment_id) {
      setError("Missing appointment or patient information.");
      return;
    }

    if (!form.reasonForFollowup.trim()) {
      setError("Reason for follow-up is required.");
      return;
    }

    if (!form.currentStatus) {
      setError("Current status is required.");
      return;
    }

    if (!form.medicationCompliance) {
      setError("Medication compliance is required.");
      return;
    }

    const followupHistoryData = {
      filledBy: "secretary",
      section: "followup_history",
      reasonForFollowup: form.reasonForFollowup,
      currentStatus: form.currentStatus,
      currentSymptoms: form.currentSymptoms,
      medicationCompliance: form.medicationCompliance,
      medicationNotes: form.medicationNotes,
      newComplaints: form.newComplaints,
      secretaryNotes: form.secretaryNotes,
      previousRecordSnapshot: previousRecord
        ? {
            record_id: previousRecord.record_id,
            record_date: previousRecord.record_date,
            diagnosis: previousRecord.diagnosis,
            treatment: previousRecord.treatment,
            medications: previousRecord.medications,
            form_type: previousRecord.form_type,
          }
        : null,
      doctorEvaluation: {
        diagnosis: "",
        treatment: "",
        medications: "",
        assessment: "",
        isContagious: false,
        contagiousDescription: "",
        evaluatedAt: null,
      },
    };

    const payload = {
      appointment_id: appointment.appointment_id,
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      clinic_id: appointment.clinic_id,
      record_date: new Date().toISOString().split("T")[0],

      diagnosis: "",
      treatment: "",
      medications: "",
      assessment: "",

      is_contagious: false,
      contagious_description: "",

      consultation_fee: 0,
      medicine_fee: 0,
      lab_fee: 0,
      other_fee: 0,
      total_amount: 0,

      form_type: "follow-up",

      form_data: {
        followup_history: followupHistoryData,
      },

      pre_employment_data: null,
    };

    const res = await createMedicalRecord(appointment.patient_id, payload);

    if (!res?.ok) {
      setError(res?.message || "Failed to save follow-up history.");
      return;
    }

    setForm(initialForm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Follow-up Patient History Form
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Patient: {patientName || "Selected Patient"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
          <div className="space-y-5 px-6 py-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* ── Previous Visit Summary (auto-pulled) ── */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
                Previous Visit (Auto-loaded)
              </h3>

              {loadingHistory && (
                <p className="text-sm text-gray-400">Loading previous record…</p>
              )}

              {!loadingHistory && !previousRecord && (
                <p className="text-sm text-gray-400">
                  No previous medical record found for this patient.
                </p>
              )}

              {previousRecord && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InfoField label="Visit Date" value={previousRecord.record_date} />
                    <InfoField label="Form Type" value={previousRecord.form_type} />
                    <InfoField label="Diagnosis" value={previousRecord.diagnosis} />
                    <InfoField label="Treatment" value={previousRecord.treatment} />
                    <InfoField label="Medications" value={previousRecord.medications} />
                    <InfoField label="Assessment" value={previousRecord.assessment} />
                  </div>

                  {previousVitals && (
                    <div className="mt-3 border-t border-gray-200 pt-3">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Last Vital Signs
                      </h4>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <InfoField label="Blood Pressure" value={previousVitals.blood_pressure} />
                        <InfoField label="Heart Rate" value={previousVitals.heart_rate ? `${previousVitals.heart_rate} bpm` : ""} />
                        <InfoField label="Temperature" value={previousVitals.temperature} />
                        <InfoField label="O₂ Saturation" value={previousVitals.oxygen_saturation ? `${previousVitals.oxygen_saturation}%` : ""} />
                        <InfoField label="Weight" value={previousVitals.weight ? `${previousVitals.weight} kg` : ""} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Secretary Intake (what the patient actually reports) ── */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                This form is filled by the secretary for follow-up visits.
                The previous visit info is shown above for reference. Only
                collect what the patient reports now.
              </p>
            </div>

            <TextArea
              label="Reason for Follow-up"
              name="reasonForFollowup"
              value={form.reasonForFollowup}
              onChange={handleChange}
              placeholder="Example: Follow-up for hypertension check, post-surgery wound review, diabetes sugar control."
              required
            />

            <SelectField
              label="Current Status"
              name="currentStatus"
              value={form.currentStatus}
              onChange={handleChange}
              options={currentStatusOptions}
              placeholder="How is the patient since last visit?"
              required
            />

            <CheckboxGroup
              title="Current Symptoms (what patient reports now)"
              options={currentSymptomsOptions}
              selected={form.currentSymptoms}
              onToggle={(value) => toggleArrayValue("currentSymptoms", value)}
            />

            <SelectField
              label="Medication Compliance"
              name="medicationCompliance"
              value={form.medicationCompliance}
              onChange={handleChange}
              options={medicationComplianceOptions}
              placeholder="Is patient taking prescribed medications?"
              required
            />

            <TextArea
              label="Medication Notes"
              name="medicationNotes"
              value={form.medicationNotes}
              onChange={handleChange}
              placeholder="Example: Patient stopped taking meds due to side effects. Reports dizziness. Type N/A if none."
            />

            <TextArea
              label="New Complaints or Changes"
              name="newComplaints"
              value={form.newComplaints}
              onChange={handleChange}
              placeholder="Example: Patient reports new headache, started low-sodium diet, changed work schedule. Type N/A if none."
            />

            <TextArea
              label="Secretary Notes"
              name="secretaryNotes"
              value={form.secretaryNotes}
              onChange={handleChange}
              placeholder="Optional notes before doctor evaluation."
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loadingCreateMedicalRecord}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingCreateMedicalRecord
                ? "Saving..."
                : "Save Follow-up History"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}

function CheckboxGroup({ title, options, selected, onToggle }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-700">
        {title}
      </h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
              selected.includes(option)
                ? "border-blue-500 bg-blue-50 text-blue-800"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-h-[100px] w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}
