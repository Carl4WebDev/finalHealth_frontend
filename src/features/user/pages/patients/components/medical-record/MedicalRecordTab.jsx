import { useEffect, useState } from "react";
import { useMedicalRecords } from "../../../../context/medical-records/useMedicalRecords.js";


import { useNavigate } from "react-router-dom";
import { useDiagnosisTreatment } from "../../../../context/diagnosis-treatments/useDiagnosisTreatment.js";
import { usePrescriptionMaster } from "../../../../context/prescriptions-master/usePrescriptionMaster.js";

/* ================= OPTIONS ================= */

const FORM_TYPE_OPTIONS = ["general", "pre-employment", "follow-up"];

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

const MEDICATION_OPTIONS = [
  "Paracetamol",
  "Amoxicillin",
  "Ibuprofen",
  "Vitamin C",
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
} = useDiagnosisTreatment();

const {
  prescriptions,
  getAllPrescriptionMasters,
} = usePrescriptionMaster();

  const [record, setRecord] = useState(DEFAULT_RECORD);
  const [diagnosis, setDiagnosis] = useState([]);
  const [treatment, setTreatment] = useState([]);
  const [medications, setMedications] = useState([]);

  const [selectedDiagnosis, setSelectedDiagnosis] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [selectedMedication, setSelectedMedication] = useState("");

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
    });

    setDiagnosis(
      parseList(medicalRecord.diagnosis).map((item) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
      }))
    );

    setTreatment(
      parseList(medicalRecord.treatment).map((item) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
      }))
    );

    setMedications(
      parseList(medicalRecord.medications).map((item) => ({
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
      }))
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
        item.id === id ? { ...item, value: newValue } : item
      )
    );
  };

  const removeItem = (id, setList) => {
    setList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    const payload = {
      appointment_id: appointmentId,
      record_date: record.recordDate,
      assessment: record.assessment,
      diagnosis: diagnosis.map((item) => item.value),
      treatment: treatment.map((item) => item.value),
      medications: medications.map((item) => item.value),
      is_contagious: record.isContagious,
      contagious_description: record.contagiousDescription,
      form_type: record.formType,
      pre_employment_data: null,
      consultation_fee: medicalRecord?.consultation_fee ?? 0,
      medicine_fee: medicalRecord?.medicine_fee ?? 0,
      lab_fee: medicalRecord?.lab_fee ?? 0,
      other_fee: medicalRecord?.other_fee ?? 0,
      doctor_id: medicalRecord?.doctor_id ?? 1,
      clinic_id: medicalRecord?.clinic_id ?? 1,
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Medical Record</h2>
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

      <div className="grid gap-4 md:grid-cols-2">
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
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Assessment
        </label>
        <select
          value={record.assessment}
          onChange={(e) =>
            setRecord((prev) => ({ ...prev, assessment: e.target.value }))
          }
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {ASSESSMENT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

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

      <TableSection
        title="Diagnosis"
options={diagnosisOptions}
onManageOptions={() => navigate("/diagnosis-treatment-management")}
        selectedValue={selectedDiagnosis}
        setSelectedValue={setSelectedDiagnosis}
        rows={diagnosis}
        onAdd={() =>
          addItem(
            selectedDiagnosis,
            diagnosis,
            setDiagnosis,
            setSelectedDiagnosis
          )
        }
        onEdit={(id, value) => updateItem(id, value, setDiagnosis)}
        onRemove={(id) => removeItem(id, setDiagnosis)}
      />

      <TableSection
        title="Treatment"
options={treatmentOptions}
onManageOptions={() => navigate("/diagnosis-treatment-management")}
        selectedValue={selectedTreatment}
        setSelectedValue={setSelectedTreatment}
        rows={treatment}
        onAdd={() =>
          addItem(
            selectedTreatment,
            treatment,
            setTreatment,
            setSelectedTreatment
          )
        }
        onEdit={(id, value) => updateItem(id, value, setTreatment)}
        onRemove={(id) => removeItem(id, setTreatment)}
      />

      <TableSection
        title="Medication"
options={medicationOptions}
onManageOptions={() => navigate("/diagnosis-treatment-management")}
        selectedValue={selectedMedication}
        setSelectedValue={setSelectedMedication}
        rows={medications}
        onAdd={() =>
          addItem(
            selectedMedication,
            medications,
            setMedications,
            setSelectedMedication
          )
        }
        onEdit={(id, value) => updateItem(id, value, setMedications)}
        onRemove={(id) => removeItem(id, setMedications)}
      />
    </div>
  );
}