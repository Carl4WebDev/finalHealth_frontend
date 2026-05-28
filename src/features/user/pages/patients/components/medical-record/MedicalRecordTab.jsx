import { useEffect, useState } from "react";
import { useMedicalRecords } from "../../../../context/medical-records/useMedicalRecords.js";

import { useNavigate } from "react-router-dom";
import { useDiagnosisTreatment } from "../../../../context/diagnosis-treatments/useDiagnosisTreatment.js";
import { usePrescriptionMaster } from "../../../../context/prescriptions-master/usePrescriptionMaster.js";
import {
  AddTextModal,
  DIAGNOSIS_STANDARD_OPTIONS,
  TREATMENT_STANDARD_OPTIONS,
  PRESCRIPTION_STANDARD_OPTIONS,
} from "../shared/AddItemModal.jsx";

/* ================= OPTIONS ================= */

const FORM_TYPE_OPTIONS = ["general", "pre-employment", "follow-up"];
const STATUS_OPTIONS = ["Scheduled", "Completed", "Cancelled"];

const RECORD_DATE_OPTIONS = [
  "2026-04-21",
  "2026-04-22",
  "2026-04-23",
  "2026-04-24",
];

const ASSESSMENT_OPTIONS = [
  "Patient is stable, responsive, and under observation for mild symptoms.",
  "Patient is improving and may continue outpatient care.",
  "Patient requires close monitoring and follow-up consultation.",
  "Patient is fit for discharge with home medication advice.",
];

const CONTAGIOUS_OPTIONS = [
  "Possible airborne transmission. Observe masking and distancing.",
  "Direct contact precaution advised.",
  "Droplet precaution recommended for 5 days.",
  "No significant spread risk beyond standard precaution.",
];

/* ================= DEFAULTS ================= */

const DEFAULT_RECORD = {
  recordDate: "2026-04-21",
  assessment: ASSESSMENT_OPTIONS[0],
  isContagious: false,
  contagiousDescription: "",
  formType: "general",
  status: "Scheduled",
  followUpDate: "",
};

/* ================= HELPERS ================= */

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const parseList = (value) => {
  if (!value) return [];

  const cleanToken = (token, index) => {
    const cleaned = String(token)
      .replace(/^[\s{\["']+/, "")
      .replace(/[\s}\]"']+$/, "")
      .trim();

    if (!cleaned) return null;

    return {
      id: `${Date.now()}-${index}`,
      value: cleaned,
      createdAt: null,
    };
  };

  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (typeof item === "string") {
          return cleanToken(item, index);
        }
        return cleanToken(item?.value, index);
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item, index) => {
            if (typeof item === "string") {
              return cleanToken(item, index);
            }
            return cleanToken(item?.value, index);
          })
          .filter(Boolean);
      }
    } catch {
      return value
        .replace(/[{}[\]]/g, "")
        .split(",")
        .map((item, index) => cleanToken(item, index))
        .filter(Boolean);
    }
  }

  return [];
};

/* ================= FORM DATA SECTION ================= */

const SKIP_KEYS = new Set(["filledBy", "section", "doctorEvaluation"]);

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

function unwrapData(raw) {
  if (!raw) return null;
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  // Unwrap single-key wrappers like { consultation_history: {...} }
  const keys = Object.keys(data);
  if (
    keys.length === 1 &&
    typeof data[keys[0]] === "object" &&
    !Array.isArray(data[keys[0]])
  ) {
    return data[keys[0]];
  }
  return data;
}

function ValueField({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium leading-snug text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}

function ArrayField({ label, items }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <p className="mt-1.5 text-sm text-gray-400">None recorded</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:col-span-2 lg:col-span-3">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ObjectField({ label, obj }) {
  if (!obj || typeof obj !== "object") return null;
  const entries = Object.entries(obj).filter(
    ([, v]) => v !== null && v !== "" && v !== undefined,
  );
  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 sm:col-span-2 lg:col-span-3">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-600">
        {label}
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([k, v]) => (
          <div
            key={k}
            className="rounded-lg border border-blue-100 bg-white p-2.5"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {formatLabel(k)}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-800">
              {typeof v === "object" ? JSON.stringify(v) : String(v)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorEvaluationCard({ data }) {
  if (!data) return null;
  const entries = Object.entries(data).filter(
    ([k, v]) =>
      k !== "evaluatedAt" && v !== null && v !== "" && v !== undefined,
  );
  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:col-span-2 lg:col-span-3">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Doctor Evaluation
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([k, v]) => (
          <div
            key={k}
            className="rounded-lg border border-emerald-100 bg-white p-2.5"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {formatLabel(k)}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-800">
              {String(v)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormDataContent({ data }) {
  const entries = Object.entries(data).filter(([k]) => !SKIP_KEYS.has(k));

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(([key, value]) => {
        if (Array.isArray(value)) {
          return (
            <ArrayField key={key} label={formatLabel(key)} items={value} />
          );
        }
        if (typeof value === "object" && value !== null) {
          return <ObjectField key={key} label={formatLabel(key)} obj={value} />;
        }
        return (
          <ValueField
            key={key}
            label={formatLabel(key)}
            value={String(value ?? "-")}
          />
        );
      })}

      {data.doctorEvaluation && (
        <DoctorEvaluationCard data={data.doctorEvaluation} />
      )}
    </div>
  );
}

function FormDataSection({ medicalRecord }) {
  const formType = (medicalRecord?.form_type || "general").toLowerCase();
  const isPreEmployment =
    formType.includes("pre_employment") || formType.includes("pre-employment");
  const preEmploymentData = unwrapData(medicalRecord?.pre_employment_data);
  const formData = unwrapData(medicalRecord?.form_data);

  const data = isPreEmployment ? preEmploymentData : formData;

  if (!data) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              {isPreEmployment ? "Pre-Employment Data" : "Consultation Data"}
            </h3>
            <p className="text-xs text-gray-400">
              No {isPreEmployment ? "pre-employment" : "consultation"} data
              recorded for this visit.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const accent = isPreEmployment
    ? {
        border: "border-amber-200",
        bg: "bg-amber-50",
        badge: "bg-amber-100 text-amber-700",
        dot: "bg-amber-400",
      }
    : {
        border: "border-blue-200",
        bg: "bg-blue-50",
        badge: "bg-blue-100 text-blue-700",
        dot: "bg-blue-400",
      };

  return (
    <div
      className={`rounded-2xl border ${accent.border} bg-white shadow-sm overflow-hidden`}
    >
      <div
        className={`flex items-center justify-between border-b ${accent.border} px-5 py-3 ${accent.bg}`}
      >
        <div className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full ${accent.dot}`} />
          <h3 className="text-sm font-semibold text-gray-800">
            {isPreEmployment ? "Pre-Employment Data" : "Consultation Data"}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <FormDataContent data={data} />
      </div>
    </div>
  );
}

/* ================= TABLE SECTION ================= */

const TableSection = ({
  title,
  options,
  selectedValue,
  setSelectedValue,
  rows,
  onAdd,
  onEdit,
  onRemove,
  onManageOptions,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditingValue(row.value);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const saveEdit = (id) => {
    if (!editingValue) return;
    onEdit(id, editingValue);
    cancelEdit();
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">
            Manage selected {title.toLowerCase()} items.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex gap-2">
            <select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select {title}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onManageOptions}
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
              title={`Manage ${title} options`}
            >
              +
            </button>
          </div>
          <button
            onClick={onAdd}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          No {title.toLowerCase()} added yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[700px]">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  {title}
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Date Added
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={
                    index !== rows.length - 1 ? "border-b border-gray-200" : ""
                  }
                >
                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {editingId === row.id ? (
                      <select
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      row.value
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-gray-500">
                    {formatDateTime(row.createdAt)}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {editingId === row.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(row.id)}
                            className="text-sm font-semibold text-green-600 hover:text-green-800"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(row)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onRemove(row.id)}
                            className="text-sm font-semibold text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

export default function MedicalRecordTab({
  appointmentId,
  patientId,
  medicalRecord,
}) {
  const {
    createMedicalRecord,
    updateMedicalRecord,
    getMedicalRecordByAppointmentId,
  } = useMedicalRecords();

  const navigate = useNavigate();

  const {
    diagnoses,
    treatments,
    getAllDiagnoses,
    getAllTreatments,
    createDiagnosis,
    createTreatment,
  } = useDiagnosisTreatment();

  const { prescriptions, getAllPrescriptionMasters, createPrescriptionMaster } =
    usePrescriptionMaster();

  const [record, setRecord] = useState(DEFAULT_RECORD);
  const [diagnosis, setDiagnosis] = useState([]);
  const [treatment, setTreatment] = useState([]);
  const [medications, setMedications] = useState([]);

  const [selectedDiagnosis, setSelectedDiagnosis] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [selectedMedication, setSelectedMedication] = useState("");

  const [isAddDiagnosisOpen, setIsAddDiagnosisOpen] = useState(false);
  const [isAddTreatmentOpen, setIsAddTreatmentOpen] = useState(false);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);

  const hasRecord = !!medicalRecord?.record_id;

  useEffect(() => {
    getAllDiagnoses();
    getAllTreatments();
    getAllPrescriptionMasters();
  }, []);

  useEffect(() => {
    if (medicalRecord === undefined) return;

    if (!medicalRecord) {
      setRecord(DEFAULT_RECORD);
      setDiagnosis([]);
      setTreatment([]);
      setMedications([]);
      return;
    }

    setRecord({
      recordDate: medicalRecord.record_date || DEFAULT_RECORD.recordDate,
      assessment: medicalRecord.assessment || DEFAULT_RECORD.assessment,
      isContagious: Boolean(medicalRecord.is_contagious),
      contagiousDescription: medicalRecord.contagious_description || "",
      formType: medicalRecord.form_type || "general",
      status: medicalRecord.status || "Scheduled",
      followUpDate: medicalRecord.follow_up_date || "",
    });
    setDiagnosis(
      parseList(medicalRecord.diagnosis).map((item) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
      })),
    );

    setTreatment(
      parseList(medicalRecord.treatment).map((item) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
      })),
    );

    setMedications(
      parseList(medicalRecord.medications).map((item) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
      })),
    );
  }, [medicalRecord]);

  const addItem = (value, list, setList, resetSelected) => {
    if (!value) return;

    const exists = list.some((item) => item.value === value);
    if (exists) {
      resetSelected("");
      return;
    }

    setList((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        value,
        createdAt: new Date().toISOString(),
      },
    ]);

    resetSelected("");
  };

  const updateItem = (id, newValue, setList) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, value: newValue } : item,
      ),
    );
  };

  const removeItem = (id, setList) => {
    setList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    const basePayload = {
      appointment_id: appointmentId,
      status: record.status,
      record_date: record.recordDate,
      assessment: record.assessment,
      diagnosis: diagnosis.map((item) => item.value),
      treatment: treatment.map((item) => item.value),
      medications: medications.map((item) => item.value),
      is_contagious: record.isContagious,
      contagious_description: record.contagiousDescription,
      form_type: record.formType,
      consultation_fee: medicalRecord?.consultation_fee ?? 0,
      medicine_fee: medicalRecord?.medicine_fee ?? 0,
      lab_fee: medicalRecord?.lab_fee ?? 0,
      other_fee: medicalRecord?.other_fee ?? 0,
      doctor_id: medicalRecord?.doctor_id ?? 1,
      clinic_id: medicalRecord?.clinic_id ?? 1,
      follow_up_date: record.followUpDate || null,
    };

    // Only include form data fields on create — updates preserve existing values via COALESCE
    const payload = hasRecord
      ? basePayload
      : {
          ...basePayload,
          pre_employment_data: medicalRecord?.pre_employment_data ?? null,
          form_data: medicalRecord?.form_data ?? null,
        };

    let res;

    if (hasRecord) {
      res = await updateMedicalRecord(medicalRecord.record_id, payload);
    } else {
      res = await createMedicalRecord(patientId, payload);
    }

    if (res?.ok !== false) {
      await getMedicalRecordByAppointmentId(appointmentId);
    }
  };

  const diagnosisOptions = diagnoses.map((item) => item.diagnosis_name);
  const treatmentOptions = treatments.map((item) => item.treatment_name);
  const medicationOptions = prescriptions.map((item) => item.prescription_name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Medical Record
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {hasRecord
              ? "Existing medical record loaded."
              : "No medical record found yet. You can prepare the data here first."}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Save Medical Record
        </button>
      </div>

      {/* Record Date, Form Type, Status */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Record Date
          </label>
          <select
            value={record.recordDate}
            onChange={(e) =>
              setRecord((prev) => ({ ...prev, recordDate: e.target.value }))
            }
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {RECORD_DATE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Form Type
          </label>
          <select
            value={record.formType}
            onChange={(e) =>
              setRecord((prev) => ({ ...prev, formType: e.target.value }))
            }
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {FORM_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Visit Status
          </label>
          <select
            value={record.status}
            onChange={(e) =>
              setRecord((prev) => ({ ...prev, status: e.target.value }))
            }
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Follow-Up Date */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Recommended Follow-Up Date
        </label>
        <p className="text-xs text-gray-400 mb-2">
          When should the patient come back?
        </p>
        <input
          type="date"
          value={record.followUpDate}
          onChange={(e) =>
            setRecord((prev) => ({ ...prev, followUpDate: e.target.value }))
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {/* Assessment */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Assessment
        </label>
        <div className="mt-2 space-y-3">
          <select
            value={
              ASSESSMENT_OPTIONS.includes(record.assessment)
                ? record.assessment
                : ""
            }
            onChange={(e) =>
              setRecord((prev) => ({ ...prev, assessment: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select Assessment</option>
            {ASSESSMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <textarea
            value={record.assessment}
            onChange={(e) =>
              setRecord((prev) => ({ ...prev, assessment: e.target.value }))
            }
            placeholder="Or type custom assessment here..."
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Contagious */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Is Contagious
            </p>
            <p className="mt-1 text-sm text-gray-700">
              {record.isContagious ? "Yes" : "No"}
            </p>
          </div>

          <button
            onClick={() =>
              setRecord((prev) => ({
                ...prev,
                isContagious: !prev.isContagious,
                contagiousDescription: !prev.isContagious
                  ? prev.contagiousDescription
                  : "",
              }))
            }
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              record.isContagious
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            Toggle
          </button>
        </div>

        {record.isContagious && (
          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Contagious Description
            </label>
            <select
              value={record.contagiousDescription}
              onChange={(e) =>
                setRecord((prev) => ({
                  ...prev,
                  contagiousDescription: e.target.value,
                }))
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select Contagious Description</option>
              {CONTAGIOUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Diagnosis */}
      <TableSection
        title="Diagnosis"
        options={diagnosisOptions}
        onManageOptions={() => setIsAddDiagnosisOpen(true)}
        selectedValue={selectedDiagnosis}
        setSelectedValue={setSelectedDiagnosis}
        rows={diagnosis}
        onAdd={() =>
          addItem(
            selectedDiagnosis,
            diagnosis,
            setDiagnosis,
            setSelectedDiagnosis,
          )
        }
        onEdit={(id, value) => updateItem(id, value, setDiagnosis)}
        onRemove={(id) => removeItem(id, setDiagnosis)}
      />

      {/* Treatment */}
      <TableSection
        title="Treatment"
        options={treatmentOptions}
        onManageOptions={() => setIsAddTreatmentOpen(true)}
        selectedValue={selectedTreatment}
        setSelectedValue={setSelectedTreatment}
        rows={treatment}
        onAdd={() =>
          addItem(
            selectedTreatment,
            treatment,
            setTreatment,
            setSelectedTreatment,
          )
        }
        onEdit={(id, value) => updateItem(id, value, setTreatment)}
        onRemove={(id) => removeItem(id, setTreatment)}
      />

      {/* Medication */}
      <TableSection
        title="Medication"
        options={medicationOptions}
        onManageOptions={() => setIsAddMedicationOpen(true)}
        selectedValue={selectedMedication}
        setSelectedValue={setSelectedMedication}
        rows={medications}
        onAdd={() =>
          addItem(
            selectedMedication,
            medications,
            setMedications,
            setSelectedMedication,
          )
        }
        onEdit={(id, value) => updateItem(id, value, setMedications)}
        onRemove={(id) => removeItem(id, setMedications)}
      />

      {/* BOTTOM — Form Data History */}
      <FormDataSection medicalRecord={medicalRecord} />

      {/* Add Modals */}
      <AddTextModal
        isOpen={isAddDiagnosisOpen}
        title="Add Diagnosis"
        placeholder="Choose or type diagnosis"
        onClose={() => setIsAddDiagnosisOpen(false)}
        onSubmit={async (value) => {
          const res = await createDiagnosis(value);
          if (res?.ok !== false) {
            await getAllDiagnoses();
            return true;
          }
          return false;
        }}
        categorizedOptions={DIAGNOSIS_STANDARD_OPTIONS}
      />

      <AddTextModal
        isOpen={isAddTreatmentOpen}
        title="Add Treatment"
        placeholder="Choose or type treatment"
        onClose={() => setIsAddTreatmentOpen(false)}
        onSubmit={async (value) => {
          const res = await createTreatment(value);
          if (res?.ok !== false) {
            await getAllTreatments();
            return true;
          }
          return false;
        }}
        categorizedOptions={TREATMENT_STANDARD_OPTIONS}
      />

      <AddTextModal
        isOpen={isAddMedicationOpen}
        title="Add Medication"
        placeholder="Choose or type medication"
        onClose={() => setIsAddMedicationOpen(false)}
        onSubmit={async (value) => {
          const res = await createPrescriptionMaster(value);
          if (res?.ok !== false) {
            await getAllPrescriptionMasters();
            return true;
          }
          return false;
        }}
        categorizedOptions={PRESCRIPTION_STANDARD_OPTIONS}
      />
    </div>
  );
}
