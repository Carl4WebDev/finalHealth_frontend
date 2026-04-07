import { useState } from "react";
import { useMedicalRecords } from "../../../context/medical-records/useMedicalRecords";

/* ---------------- HARDCODED OPTIONS ---------------- */

const DIAGNOSIS_OPTIONS = [
  "Hypertension",
  "Diabetes Mellitus",
  "Upper Respiratory Infection",
  "Gastroenteritis",
  "Migraine",
];

const TREATMENT_OPTIONS = [
  "Medication Therapy",
  "Physical Therapy",
  "Lifestyle Modification",
  "Observation",
  "Referral to Specialist",
];

const MEDICATION_OPTIONS = [
  "Paracetamol",
  "Amoxicillin",
  "Metformin",
  "Losartan",
  "Ibuprofen",
];

const TEST_TYPE_OPTIONS = [
  "CBC",
  "X-Ray",
  "Urinalysis",
  "Blood Sugar Test",
  "ECG",
];

const REFERRAL_OPTIONS = [
  "Cardiologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Dermatologist",
];

const CERTIFICATE_OPTIONS = [
  "Medical Certificate",
  "Fit to Work",
  "Fit to Travel",
  "Sick Leave",
  "Fitness Clearance",
];

export default function AddMedicalRecordModal({ isOpen, onClose, patientId }) {
  const {
    createMedicalRecord,
    uploadMedicalRecordDocument,
    getPatientMedRecord,
  } = useMedicalRecords();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    record_date: "",
    diagnosis: "",
    treatment: "",
    medications: "",
    assessment: "",
    blood_pressure: "",
    heart_rate: "",
    temperature: "",
    oxygen_saturation: "",
    weight: "",
    medication_name: "",
    dosage: "",
    frequency: "",
    duration: "",
    test_type: "",
    result: "",
    interpretation: "",
    referred_to: "",
    reason: "",
    followup_date: "",
    notes: "",
    certificate_type: "",
    remarks: "",
  });

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

const handleSubmit = async () => {
  setSubmitError("");

  if (!form.diagnosis) {
    setSubmitError("Diagnosis is required");
    return;
  }

  const doctorId = localStorage.getItem("selectedDoctorIdPatientPage");
  const clinicId = localStorage.getItem("selectedClinicIdPatientPage");

  const payload = {
    ...form,
    doctor_id: Number(doctorId),
    clinic_id: Number(clinicId),
  };

  const res = await createMedicalRecord(patientId, payload);

  if (!res?.ok) {
    setSubmitError(res?.message || "Something went wrong.");
    return;
  }

  const recordId = res?.record?.recordId;

  if (recordId && selectedFiles.length > 0) {
    for (const file of selectedFiles) {
      const uploadRes = await uploadMedicalRecordDocument(recordId, file);

      if (!uploadRes?.ok) {
        setSubmitError(uploadRes?.message || "Failed to upload document.");
        return;
      }
    }
  }

  await getPatientMedRecord(patientId);
  onClose();
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-blue-50/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-4xl rounded-2xl border-4 border-blue-600 shadow-xl p-6 space-y-6 overflow-y-auto max-h-[90vh] z-10">
        {submitError && (
  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
    {submitError}
  </div>
)}
        <h3 className="text-xl font-semibold text-blue-700 text-center">
          Add Medical Record
        </h3>

        {/* VISIT INFO */}
        <Section title="Visit Information">
          <Input
            label="Record Date"
            type="date"
            onChange={(v) => handleChange("record_date", v)}
          />
          <Input
            label="Assessment"
            onChange={(v) => handleChange("assessment", v)}
          />
        </Section>

        {/* DIAGNOSIS */}
        <Section title="Diagnosis">
          <SelectInput
            label="Diagnosis"
            options={DIAGNOSIS_OPTIONS}
            onChange={(v) => handleChange("diagnosis", v)}
          />
          <SelectInput
            label="Treatment"
            options={TREATMENT_OPTIONS}
            onChange={(v) => handleChange("treatment", v)}
          />
          <SelectInput
            label="Medications"
            options={MEDICATION_OPTIONS}
            onChange={(v) => handleChange("medications", v)}
          />
        </Section>

        {/* IMAGES */}
        <Section title="Medical Record Images">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </Section>

        {/* VITAL SIGNS */}
        <Section title="Vital Signs">
          <Input
            label="Blood Pressure"
            placeholder="120/80"
            onChange={(v) => handleChange("blood_pressure", v)}
          />
          <Input
            label="Heart Rate"
            placeholder="72 bpm"
            onChange={(v) => handleChange("heart_rate", v)}
          />
          <Input
            label="Temperature (°C)"
            placeholder="36.5"
            onChange={(v) => handleChange("temperature", v)}
          />
          <Input
            label="Oxygen Saturation (%)"
            placeholder="98"
            onChange={(v) => handleChange("oxygen_saturation", v)}
          />
          <Input
            label="Weight (kg)"
            placeholder="65"
            onChange={(v) => handleChange("weight", v)}
          />
        </Section>

        {/* LAB RESULT */}
        <Section title="Lab Result">
          <SelectInput
            label="Test Type"
            options={TEST_TYPE_OPTIONS}
            onChange={(v) => handleChange("test_type", v)}
          />
          <Input label="Result" onChange={(v) => handleChange("result", v)} />
          <Input
            label="Interpretation"
            onChange={(v) => handleChange("interpretation", v)}
          />
        </Section>

        {/* REFERRAL */}
        <Section title="Referral">
          <SelectInput
            label="Referred To"
            options={REFERRAL_OPTIONS}
            onChange={(v) => handleChange("referred_to", v)}
          />
          <Input label="Reason" onChange={(v) => handleChange("reason", v)} />
        </Section>

        {/* CERTIFICATE */}
        <Section title="Certificate">
          <SelectInput
            label="Certificate Type"
            options={CERTIFICATE_OPTIONS}
            onChange={(v) => handleChange("certificate_type", v)}
          />
          <Input label="Remarks" onChange={(v) => handleChange("remarks", v)} />
        </Section>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-4">
      <h4 className="font-semibold text-blue-700 text-sm uppercase tracking-wide">
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label, type = "text", placeholder = "", onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SelectInput({ label, options, onChange }) {
  const listId = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <input
        type="text"
        list={listId}
        placeholder={`Select or type ${label}`}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => onChange(e.target.value)}
      />

      <datalist id={listId}>
        {options.map((o, i) => (
          <option key={i} value={o} />
        ))}
      </datalist>
    </div>
  );
}
