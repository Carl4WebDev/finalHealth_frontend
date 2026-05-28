import { useEffect, useState } from "react";
import { useMedicalRecords } from "../../../context/medical-records/useMedicalRecords";
import { useDiagnosisTreatment } from "../../../context/diagnosis-treatments/useDiagnosisTreatment";

const PAST_MEDICAL_HISTORY_OPTIONS = [
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Allergies",
  "Previous Surgery",
  "Lung Disease",
  "Cardiac Disease",
  "Medications",
  "Others",
];

const FAMILY_HISTORY_OPTIONS = [
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Allergies",
  "Previous Surgery",
  "Lung Disease",
  "Cardiac Disease",
  "Others",
];

const SOCIAL_HISTORY_OPTIONS = [
  "Smoker",
  "Alcoholic beverage drinker",
  "Use of illicit drugs",
];

const RECOMMENDATION_OPTIONS = [
  "Physically fit for employment at the time of examination",
  "Physically fit for employment with findings at the time of Examination",
  "With obvious defect but maybe employed at management discretion",
  "Medically unfit for employment",
];

export default function AddPreEmploymentModal({
  isOpen,
  onClose,
  patientId,
}) {
  const { createMedicalRecord, getPatientMedRecord } = useMedicalRecords();
  const { diagnoses, treatments, getAllDiagnoses, getAllTreatments } =
  useDiagnosisTreatment();

  const [submitError, setSubmitError] = useState("");


  useEffect(() => {
    if (isOpen) {
      getAllDiagnoses();
      getAllTreatments();
    }
  }, [isOpen]);

const [form, setForm] = useState({
  record_date: "",
  diagnosis: "",
  treatment: "",
  medications: "",
  assessment: "Pre-employment exam",
  requestingFor: "Pre-Employment",

  findings: "",
  recommendation: "",
  medicalExaminer: "",
  licenseNumber: "",

  consultation_fee: "",
  medicine_fee: "",
  lab_fee: "",
  other_fee: "",

  physicalExam: {
    bp: "",
    hr: "",
    temp: "",
    rr: "",
    height: "",
    weight: "",
    bmi: "",
  },

  pastMedicalHistory: [],
  familyHistory: [],
  socialHistory: [],
});

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhysicalExamChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      physicalExam: {
        ...prev.physicalExam,
        [key]: value,
      },
    }));
  };

  const handleCheckboxArray = (field, value) => {
    setForm((prev) => {
      const current = prev[field];
      const exists = current.includes(value);

      return {
        ...prev,
        [field]: exists
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  

  const handleSubmit = async () => {
    setSubmitError("");

    if (!form.record_date) {
      setSubmitError("Record date is required");
      return;
    }

    const doctorId = localStorage.getItem("selectedDoctorIdPatientPage");
    const clinicId = localStorage.getItem("selectedClinicIdPatientPage");

    if (!doctorId || !clinicId) {
      setSubmitError("Doctor and clinic must be selected first.");
      return;
    }

const payload = {
  record_date: form.record_date,
  diagnosis: form.diagnosis,
  treatment: form.treatment,
  medications: form.medications,
  assessment: form.assessment,
  consultation_fee: form.consultation_fee,
  medicine_fee: form.medicine_fee,
  lab_fee: form.lab_fee,
  other_fee: form.other_fee,
  doctor_id: Number(doctorId),
  clinic_id: Number(clinicId),
  form_type: "pre_employment",
  pre_employment_data: {
    requestingFor: form.requestingFor,
    findings: form.findings,
    recommendation: form.recommendation,
    medicalExaminer: form.medicalExaminer,
    licenseNumber: form.licenseNumber,
    physicalExam: form.physicalExam,
    pastMedicalHistory: form.pastMedicalHistory,
    familyHistory: form.familyHistory,
    socialHistory: form.socialHistory,
  },
};

    const res = await createMedicalRecord(patientId, payload);

    if (!res?.ok) {
      setSubmitError(res?.message || "Something went wrong.");
      return;
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

      <div className="relative z-10 max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border-4 border-blue-600 bg-white p-6 shadow-xl space-y-6">
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <h3 className="text-center text-xl font-semibold text-blue-700">
          Add Pre-Employment Record
        </h3>

<Section title="Basic Information">
  <Input
    label="Record Date"
    type="date"
    value={form.record_date}
    onChange={(v) => handleChange("record_date", v)}
  />
  <Input
    label="Requesting For"
    value={form.requestingFor}
    onChange={(v) => handleChange("requestingFor", v)}
  />
  <SelectInput
    label="Diagnosis"
    options={diagnoses.map((d) => d.diagnosis_name)}
    value={form.diagnosis}
    onChange={(v) => handleChange("diagnosis", v)}
  />
  <SelectInput
    label="Treatment"
    options={treatments.map((t) => t.treatment_name)}
    value={form.treatment}
    onChange={(v) => handleChange("treatment", v)}
  />
  <Input
    label="Medications"
    value={form.medications}
    onChange={(v) => handleChange("medications", v)}
  />
  <Input
    label="Assessment"
    value={form.assessment}
    onChange={(v) => handleChange("assessment", v)}
  />
</Section>

        <Section title="Past Medical History">
          <CheckboxGroup
            options={PAST_MEDICAL_HISTORY_OPTIONS}
            selected={form.pastMedicalHistory}
            onToggle={(value) =>
              handleCheckboxArray("pastMedicalHistory", value)
            }
          />
        </Section>

        <Section title="Family History">
          <CheckboxGroup
            options={FAMILY_HISTORY_OPTIONS}
            selected={form.familyHistory}
            onToggle={(value) => handleCheckboxArray("familyHistory", value)}
          />
        </Section>

        <Section title="Social History">
          <CheckboxGroup
            options={SOCIAL_HISTORY_OPTIONS}
            selected={form.socialHistory}
            onToggle={(value) => handleCheckboxArray("socialHistory", value)}
          />
        </Section>

        <Section title="Physical Exam">
          <Input
            label="BP"
            placeholder="120/80"
            value={form.physicalExam.bp}
            onChange={(v) => handlePhysicalExamChange("bp", v)}
          />
          <Input
            label="HR"
            placeholder="72"
            value={form.physicalExam.hr}
            onChange={(v) => handlePhysicalExamChange("hr", v)}
          />
          <Input
            label="Temp"
            placeholder="36.6"
            value={form.physicalExam.temp}
            onChange={(v) => handlePhysicalExamChange("temp", v)}
          />
          <Input
            label="RR"
            placeholder="18"
            value={form.physicalExam.rr}
            onChange={(v) => handlePhysicalExamChange("rr", v)}
          />
          <Input
            label="Height"
            placeholder="170 cm"
            value={form.physicalExam.height}
            onChange={(v) => handlePhysicalExamChange("height", v)}
          />
          <Input
            label="Weight"
            placeholder="65 kg"
            value={form.physicalExam.weight}
            onChange={(v) => handlePhysicalExamChange("weight", v)}
          />
          <Input
            label="BMI"
            placeholder="22.5"
            value={form.physicalExam.bmi}
            onChange={(v) => handlePhysicalExamChange("bmi", v)}
          />
        </Section>

        <Section title="Findings and Recommendation">
          <Input
            label="Findings"
            value={form.findings}
            onChange={(v) => handleChange("findings", v)}
          />
          <SelectInput
            label="Recommendation"
            options={RECOMMENDATION_OPTIONS}
            value={form.recommendation}
            onChange={(v) => handleChange("recommendation", v)}
          />
          <Input
            label="Medical Examiner"
            value={form.medicalExaminer}
            onChange={(v) => handleChange("medicalExaminer", v)}
          />
          <Input
            label="License Number"
            value={form.licenseNumber}
            onChange={(v) => handleChange("licenseNumber", v)}
          />
        </Section>

<Section title="Fees">
  <Input
    label="Consultation Fee"
    type="number"
    placeholder="0.00"
    value={form.consultation_fee}
    onChange={(v) => handleChange("consultation_fee", v)}
  />
  <Input
    label="Medicine Fee"
    type="number"
    placeholder="0.00"
    value={form.medicine_fee}
    onChange={(v) => handleChange("medicine_fee", v)}
  />
  <Input
    label="Lab Fee"
    type="number"
    placeholder="0.00"
    value={form.lab_fee}
    onChange={(v) => handleChange("lab_fee", v)}
  />
  <Input
    label="Other Fee"
    type="number"
    placeholder="0.00"
    value={form.other_fee}
    onChange={(v) => handleChange("other_fee", v)}
  />
</Section>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-5 py-2 transition hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Save Pre-Employment Record
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-4">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-blue-700">
        {title}
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Input({
  label,
  type = "text",
  placeholder = "",
  value = "",
  onChange,
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SelectInput({ label, options, value = "", onChange }) {
  const listId = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        list={listId}
        value={value}
        placeholder={`Select or type ${label}`}
        className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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

function CheckboxGroup({ options, selected, onToggle }) {
  return (
    <div className="md:col-span-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center gap-2 text-sm text-gray-700"
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}