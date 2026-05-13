import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMedicalRecords } from "../../../../context/medical-records/useMedicalRecords.js";
import { useLabResultMaster } from "../../../../context/lab-result-master/useLabResultMaster.js";

export default function LabResultsTab({ recordId, patientId }) {
  const navigate = useNavigate();

  const {
    labResults,
    loadingLabResults,
    getLabResultsByRecord,
    createLabResult,
    updateLabResult,
    deleteLabResult,
  } = useMedicalRecords();

  const { labResults: labResultOptions, getAllLabResultMasters } =
    useLabResultMaster();

  const [form, setForm] = useState({
    test_type: "",
    result: "",
    interpretation: "",
    lab_img_path: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    test_type: "",
    result: "",
    interpretation: "",
    lab_img_path: "",
  });

  const [previewImage, setPreviewImage] = useState(null);

  const testTypeOptions = labResultOptions.map((item) => item.lab_result_name);

  const getNow = () => new Date().toLocaleDateString();

  useEffect(() => {
    getAllLabResultMasters();
  }, []);

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
        lab_img_path: "",
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
      lab_img_path: item.lab_img_path || "",
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

  const handleImagePlaceholder = () => {
    alert("Image upload placeholder only. Implement actual upload later.");
  };

  const handleViewImage = (imagePath) => {
    if (!imagePath) {
      alert("No image uploaded yet.");
      return;
    }

    setPreviewImage(imagePath);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Lab Results</h2>

      <div className="rounded-xl bg-gray-50 p-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex gap-2">
            <select
              value={form.test_type}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, test_type: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select Test Type</option>
              {testTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => navigate("/diagnosis-treatment-management")}
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
              title="Manage lab result options"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleImagePlaceholder}
            className="rounded-lg border border-dashed border-gray-400 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            Upload Lab Image Placeholder
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Image Status:{" "}
          <span className="font-semibold text-red-600">No image uploaded</span>
        </p>

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
                  Image Status
                </th>
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
                      <div className="flex gap-2">
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
                          <option value="">Select Test Type</option>
                          {testTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() =>
                            navigate("/diagnosis-treatment-management")
                          }
                          className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
                          title="Manage lab result options"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      item.test_type
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-sm">
                    {item.lab_img_path ? (
                      <button
                        onClick={() => handleViewImage(item.lab_img_path)}
                        className="font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View Image
                      </button>
                    ) : (
                      <button
                        onClick={handleImagePlaceholder}
                        className="font-semibold text-red-500 hover:text-red-700"
                      >
                        No Image - Upload
                      </button>
                    )}
                  </td>

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

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Lab Image Preview
              </h3>

              <button
                onClick={() => setPreviewImage(null)}
                className="text-xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
              Image preview placeholder:
              <div className="mt-2 font-semibold text-gray-700">
                {previewImage}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}