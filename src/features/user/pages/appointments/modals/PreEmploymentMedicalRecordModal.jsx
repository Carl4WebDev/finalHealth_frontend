import { useState } from "react";
import { useMedicalRecords } from "../../../context/medical-records/useMedicalRecords";

const initialForm = {
  requestingFor: "",
  pastMedicalHistory: [],
  familyHistory: [],
  socialHistory: [],
  currentSymptoms: [],
  allergies: "",
  previousSurgery: "",
  hospitalizationHistory: "",
  currentMedications: "",
  secretaryNotes: "",
};

const pastHistoryOptions = [
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Tuberculosis",
  "Heart Disease",
  "Kidney Disease",
  "Cancer",
  "Seizure Disorder",
  "Mental Health Condition",
  "Thyroid Disease",
];

const familyHistoryOptions = [
  "Hypertension",
  "Diabetes",
  "Heart Disease",
  "Cancer",
  "Asthma",
  "Stroke",
  "Tuberculosis",
  "Mental Health Condition",
];

const socialHistoryOptions = [
  "Smoking",
  "Alcohol Intake",
  "Drug Use",
  "Regular Exercise",
  "Night Shift Work",
  "Lack of Sleep",
];

const symptomsOptions = [
  "Fever",
  "Cough",
  "Chest Pain",
  "Shortness of Breath",
  "Headache",
  "Dizziness",
  "Body Weakness",
  "Weight Loss",
  "Fatigue",
  "Abdominal Pain",
];

export default function PreEmploymentMedicalRecordModal({
  isOpen,
  onClose,
  appointment,
}) {
  const { createMedicalRecord, loadingCreateMedicalRecord } =
    useMedicalRecords();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const patientName = `${appointment?.patient_f_name || ""} ${
    appointment?.patient_m_name || ""
  } ${appointment?.patient_l_name || ""}`.trim();

  const toggleArrayValue = (field, value) => {
    setForm((prev) => {
      const alreadySelected = prev[field].includes(value);

      return {
        ...prev,
        [field]: alreadySelected
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      };
    });

    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointment?.patient_id || !appointment?.appointment_id) {
      setError("Missing appointment or patient information.");
      return;
    }

    if (!form.requestingFor.trim()) {
      setError("Requesting company or purpose is required.");
      return;
    }

    if (!form.allergies.trim()) {
  setError("Allergies field is required. Type N/A if none.");
  return;
}

if (!form.previousSurgery.trim()) {
  setError("Previous surgery field is required. Type N/A if none.");
  return;
}

if (!form.hospitalizationHistory.trim()) {
  setError("Hospitalization history is required. Type N/A if none.");
  return;
}

if (!form.currentMedications.trim()) {
  setError("Current medications field is required. Type N/A if none.");
  return;
}

    const preEmploymentData = {
      filledBy: "secretary",
      section: "patient_history",
      requestingFor: form.requestingFor,
      pastMedicalHistory: form.pastMedicalHistory,
      familyHistory: form.familyHistory,
      socialHistory: form.socialHistory,
      currentSymptoms: form.currentSymptoms,
      allergies: form.allergies,
      previousSurgery: form.previousSurgery,
      hospitalizationHistory: form.hospitalizationHistory,
      currentMedications: form.currentMedications,
      secretaryNotes: form.secretaryNotes,
      doctorEvaluation: {
        physicalFindings: "",
        recommendation: "",
        fitnessStatus: "",
        medicalExaminer: "",
        licenseNumber: "",
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

  form_type: "pre_employment",

  form_data: {
    pre_employment_history: preEmploymentData,
  },

  pre_employment_data: preEmploymentData,
};

    const res = await createMedicalRecord(appointment.patient_id, payload);

    if (!res?.ok) {
      setError(res?.message || "Failed to save pre-employment history.");
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
              Pre-Employment Patient History Form
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

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                This form is filled by the secretary before doctor evaluation.
                It records the patient’s medical background for pre-employment
                screening.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Requesting For / Company / Purpose{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="requestingFor"
                value={form.requestingFor}
                onChange={handleChange}
                placeholder="Example: ABC Company - Pre-employment requirement"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <CheckboxGroup
              title="Past Medical History"
              options={pastHistoryOptions}
              selected={form.pastMedicalHistory}
              onToggle={(value) => toggleArrayValue("pastMedicalHistory", value)}
            />

            <TextArea
              label="Allergies"
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              placeholder="Example: Food, medicine, environmental allergies. Type N/A if none."
              required
            />

            <TextArea
              label="Previous Surgery"
              name="previousSurgery"
              value={form.previousSurgery}
              onChange={handleChange}
              placeholder="Example: Appendectomy, C-section, fracture surgery. Type N/A if none."
              required
           />

            <TextArea
              label="Hospitalization History"
              name="hospitalizationHistory"
              value={form.hospitalizationHistory}
              onChange={handleChange}
              placeholder="Example: Reason and date of hospitalization. Type N/A if none."
              required
            />

            <TextArea
              label="Current Medications"
              name="currentMedications"
              value={form.currentMedications}
              onChange={handleChange}
              placeholder="Example: Maintenance medicine, vitamins, supplements. Type N/A if none."
            required
            />

            <CheckboxGroup
              title="Family History"
              options={familyHistoryOptions}
              selected={form.familyHistory}
              onToggle={(value) => toggleArrayValue("familyHistory", value)}
            />

            <CheckboxGroup
              title="Social History / Lifestyle"
              options={socialHistoryOptions}
              selected={form.socialHistory}
              onToggle={(value) => toggleArrayValue("socialHistory", value)}
            />

            <CheckboxGroup
              title="Current Symptoms"
              options={symptomsOptions}
              selected={form.currentSymptoms}
              onToggle={(value) => toggleArrayValue("currentSymptoms", value)}
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
                : "Save Patient History"}
            </button>
          </div>
        </form>
      </div>
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

function TextArea({ label, name, value, onChange, placeholder = "", required=false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
{label} {required && <span className="text-red-500">*</span>}      </label>

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