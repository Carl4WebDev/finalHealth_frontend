import { useEffect, useState } from "react";
import { useMedicalRecords } from "../../../../context/medical-records/useMedicalRecords.js";
import { useNavigate } from "react-router-dom";
import { usePrescriptionMaster } from "../../../../context/prescriptions-master/usePrescriptionMaster";
import { AddTextModal, PRESCRIPTION_STANDARD_OPTIONS } from "../shared/AddItemModal.jsx";

const MEDICATION_OPTIONS = [
  "Paracetamol",
  "Amoxicillin",
  "Ibuprofen",
  "Vitamin C",
];

const DOSAGE_OPTIONS = ["250mg", "500mg", "1 tablet", "10mL"];
const FREQUENCY_OPTIONS = ["Once a day", "Twice a day", "3x a day", "Every 6 hours"];
const DURATION_OPTIONS = ["3 days", "5 days", "7 days", "14 days"];

export default function PrescriptionTab({ recordId, patientId }) {
  const {
    prescriptions,
    loadingPrescriptions,
    getPrescriptionsByRecord,
    createPrescription,
    updatePrescription,
    deletePrescription,
  } = useMedicalRecords();


  const navigate = useNavigate();

const {
  prescriptions: prescriptionOptions,
  getAllPrescriptionMasters,
  createPrescriptionMaster,
} = usePrescriptionMaster();

  const [isAddPrescriptionOpen, setIsAddPrescriptionOpen] = useState(false);

  const [form, setForm] = useState({
    medication_name: "",
    dosage: "",
    frequency: "",
    duration: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    medication_name: "",
    dosage: "",
    frequency: "",
    duration: "",
  });

  useEffect(() => {
  getAllPrescriptionMasters();
}, []);

  useEffect(() => {
    if (recordId) {
      getPrescriptionsByRecord(recordId);
    }
  }, [recordId]);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-CA");
  };

  const handleCreate = async () => {
    if (!form.medication_name) return;

    const res = await createPrescription(recordId, {
      patient_id: patientId,
      ...form,
    });

    if (res?.ok !== false) {
      setForm({
        medication_name: "",
        dosage: "",
        frequency: "",
        duration: "",
      });
      getPrescriptionsByRecord(recordId);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.prescription_id);
    setEditForm({
      medication_name: item.medication_name || "",
      dosage: item.dosage || "",
      frequency: item.frequency || "",
      duration: item.duration || "",
    });
  };

  const handleUpdate = async (prescriptionId) => {
    const res = await updatePrescription(prescriptionId, {
      patient_id: patientId,
      ...editForm,
    });

    if (res?.ok !== false) {
      setEditingId(null);
      getPrescriptionsByRecord(recordId);
    }
  };

  const handleDelete = async (prescriptionId) => {
    const res = await deletePrescription(prescriptionId);

    if (res?.ok !== false) {
      getPrescriptionsByRecord(recordId);
    }
  };

  const medicationOptions = prescriptionOptions.map(
  (item) => item.prescription_name
);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Prescription</h2>

      <div className="rounded-xl bg-gray-50 p-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
<div className="flex gap-2">
  <select
    value={form.medication_name}
    onChange={(e) =>
      setForm((prev) => ({ ...prev, medication_name: e.target.value }))
    }
    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
  >
    <option value="">Select Medication</option>

    {medicationOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>

  <button
    type="button"
    onClick={() => setIsAddPrescriptionOpen(true)}
    className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
    title="Manage prescription options"
  >
    +
  </button>
</div>

<input
  list="dosage-options"
  value={form.dosage}
  onChange={(e) =>
    setForm((prev) => ({ ...prev, dosage: e.target.value }))
  }
  placeholder="Select or type dosage"
  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
/>

<datalist id="dosage-options">
  {DOSAGE_OPTIONS.map((option) => (
    <option key={option} value={option} />
  ))}
</datalist>

<input
  list="frequency-options"
  value={form.frequency}
  onChange={(e) =>
    setForm((prev) => ({ ...prev, frequency: e.target.value }))
  }
  placeholder="Select or type frequency"
  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
/>

<datalist id="frequency-options">
  {FREQUENCY_OPTIONS.map((option) => (
    <option key={option} value={option} />
  ))}
</datalist>
<input
  list="duration-options"
  value={form.duration}
  onChange={(e) =>
    setForm((prev) => ({ ...prev, duration: e.target.value }))
  }
  placeholder="Select or type duration"
  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
/>

<datalist id="duration-options">
  {DURATION_OPTIONS.map((option) => (
    <option key={option} value={option} />
  ))}
</datalist>
        </div>

        <button
          onClick={handleCreate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add Prescription
        </button>
      </div>

      {loadingPrescriptions ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          Loading prescriptions...
        </div>
      ) : !prescriptions?.length ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          No prescriptions found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">Medication</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Dosage</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Frequency</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Duration</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((item, index) => (
                <tr
                  key={item.prescription_id}
                  className={index !== prescriptions.length - 1 ? "border-b border-gray-200" : ""}
                >
                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {editingId === item.prescription_id ? (
                      <select
                        value={editForm.medication_name}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            medication_name: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                       {medicationOptions.map((option) => (
  <option key={option} value={option}>
    {option}
  </option>
))}
                      </select>
                    ) : (
                      item.medication_name
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {editingId === item.prescription_id ? (
<>
  <input
    list="edit-dosage-options"
    value={editForm.dosage}
    onChange={(e) =>
      setEditForm((prev) => ({ ...prev, dosage: e.target.value }))
    }
    placeholder="Select or type dosage"
    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
  />

  <datalist id="edit-dosage-options">
    {DOSAGE_OPTIONS.map((option) => (
      <option key={option} value={option} />
    ))}
  </datalist>
</>
                    ) : (
                      item.dosage || "-"
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {editingId === item.prescription_id ? (
                      <select
                        value={editForm.frequency}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, frequency: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        {FREQUENCY_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.frequency || "-"
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {editingId === item.prescription_id ? (
                      <select
                        value={editForm.duration}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, duration: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        {DURATION_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.duration || "-"
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {formatDate(item.prescribed_date || item.created_at)}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {editingId === item.prescription_id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(item.prescription_id)}
                            className="text-sm font-semibold text-green-600 hover:text-green-800"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(item)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.prescription_id)}
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

      <AddTextModal
        isOpen={isAddPrescriptionOpen}
        title="Add Medication"
        placeholder="Choose or type medication"
        onClose={() => setIsAddPrescriptionOpen(false)}
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