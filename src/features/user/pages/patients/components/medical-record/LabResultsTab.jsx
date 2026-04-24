import { useEffect, useState } from "react";
import { useMedicalRecords } from "../../../../context/medical-records/useMedicalRecords.js";

const TEST_TYPE_OPTIONS = [
  "Blood Test",
  "Urinalysis",
  "X-Ray",
  "ECG",
];

const RESULT_OPTIONS = ["Normal", "Needs Review", "Abnormal", "Pending"];
const INTERPRETATION_OPTIONS = [
  "Within normal range",
  "Requires follow-up",
  "Needs specialist review",
  "Pending validation",
];

export default function LabResultsTab({ recordId, patientId }) {
  const {
    labResults,
    loadingLabResults,
    getLabResultsByRecord,
    createLabResult,
    updateLabResult,
    deleteLabResult,
  } = useMedicalRecords();

  const [form, setForm] = useState({
    test_type: "",
    result: "",
    interpretation: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    test_type: "",
    result: "",
    interpretation: "",
  });

  // ✅ LIVE DATE PLACEHOLDER
  const getNow = () => new Date().toLocaleDateString();

  useEffect(() => {
    if (recordId) {
      getLabResultsByRecord(recordId);
    }
  }, [recordId]);

  const handleCreate = async () => {
    if (!form.test_type) return;

    const res = await createLabResult(recordId, {
      patient_id: patientId,
      ...form,
    });

    if (res?.ok !== false) {
      setForm({
        test_type: "",
        result: "",
        interpretation: "",
      });
      getLabResultsByRecord(recordId);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.result_id);
    setEditForm({
      test_type: item.test_type || "",
      result: item.result || "",
      interpretation: item.interpretation || "",
    });
  };

  const handleUpdate = async (resultId) => {
    const res = await updateLabResult(resultId, {
      patient_id: patientId,
      ...editForm,
    });

    if (res?.ok !== false) {
      setEditingId(null);
      getLabResultsByRecord(recordId);
    }
  };

  const handleDelete = async (resultId) => {
    const res = await deleteLabResult(resultId);

    if (res?.ok !== false) {
      getLabResultsByRecord(recordId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Lab Results</h2>

      <div className="rounded-xl bg-gray-50 p-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <select
            value={form.test_type}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, test_type: e.target.value }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select Test Type</option>
            {TEST_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={form.result}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, result: e.target.value }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select Result</option>
            {RESULT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={form.interpretation}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                interpretation: e.target.value,
              }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select Interpretation</option>
            {INTERPRETATION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCreate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add Lab Result
        </button>
      </div>

      {loadingLabResults ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          Loading lab results...
        </div>
      ) : !labResults?.length ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          No lab results found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Test Type
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Result
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Interpretation
                </th>
                {/* ✅ NEW DATE COLUMN */}
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {labResults.map((item, index) => (
                <tr
                  key={item.result_id}
                  className={
                    index !== labResults.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }
                >
                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {editingId === item.result_id ? (
                      <select
                        value={editForm.test_type}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            test_type: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        {TEST_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.test_type
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {editingId === item.result_id ? (
                      <select
                        value={editForm.result}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            result: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        {RESULT_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.result || "-"
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {editingId === item.result_id ? (
                      <select
                        value={editForm.interpretation}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            interpretation: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        {INTERPRETATION_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.interpretation || "-"
                    )}
                  </td>

                  {/* ✅ DATE CELL */}
                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {getNow()}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {editingId === item.result_id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(item.result_id)}
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
                            onClick={() => handleDelete(item.result_id)}
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
}