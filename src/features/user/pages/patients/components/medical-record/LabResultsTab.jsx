import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMedicalRecords } from "../../../../context/medical-records/useMedicalRecords.js";
import { useLabResultMaster } from "../../../../context/lab-result-master/useLabResultMaster.js";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function LabResultsTab({ recordId, patientId }) {
  const navigate = useNavigate();

  const {
    labResults,
    loadingLabResults,
    getLabResultsByRecord,
    createLabResult,
    updateLabResult,
    deleteLabResult,
    updateLabResultImage,
  } = useMedicalRecords();

  const { labResults: labResultOptions, getAllLabResultMasters } =
    useLabResultMaster();

  const [form, setForm] = useState({
    test_type: "",
    result: "",
    interpretation: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [editForm, setEditForm] = useState({
    test_type: "",
    result: "",
    interpretation: "",
    lab_img_path: "",
  });

  const testTypeOptions = labResultOptions.map((item) => item.lab_result_name);

  useEffect(() => {
    getAllLabResultMasters();
  }, []);

  useEffect(() => {
    if (recordId) {
      getLabResultsByRecord(recordId);
    }
  }, [recordId]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE}${imagePath}`;
  };

  const handleCreate = async () => {
    if (!recordId || !form.test_type) return;

    const formData = new FormData();
    formData.append("patient_id", patientId);
    formData.append("test_type", form.test_type);
    formData.append("result", form.result || "");
    formData.append("interpretation", form.interpretation || "");

    if (selectedFile) {
      formData.append("lab_image", selectedFile);
    }

    const res = await createLabResult(recordId, formData);

    if (res?.ok !== false) {
      setForm({
        test_type: "",
        result: "",
        interpretation: "",
      });
      setSelectedFile(null);
      await getLabResultsByRecord(recordId);
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
      await getLabResultsByRecord(recordId);
    }
  };

  const handleDelete = async (resultId) => {
    const res = await deleteLabResult(resultId);

    if (res?.ok !== false) {
      await getLabResultsByRecord(recordId);
    }
  };

  const handleUploadExistingImage = async (labResultId, file) => {
    if (!file) return;

    const res = await updateLabResultImage(labResultId, recordId, file);

    if (res?.ok !== false) {
      await getLabResultsByRecord(recordId);
    }
  };

  const handleViewImage = (imagePath) => {
    if (!imagePath) return;
    setPreviewImage(getImageUrl(imagePath));
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
              onClick={() => navigate("/user/patients/management")}
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
              title="Manage lab result options"
            >
              +
            </button>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="rounded-lg border border-dashed border-gray-400 bg-white px-4 py-2 text-sm"
          />
        </div>

        <p className="text-sm text-gray-500">
          Image Status:{" "}
          {selectedFile ? (
            <span className="font-semibold text-green-600">
              {selectedFile.name}
            </span>
          ) : (
            <span className="font-semibold text-red-600">
              No image uploaded
            </span>
          )}
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
                        <option value="">Select Test Type</option>
                        {testTypeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
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
                      <label className="cursor-pointer font-semibold text-red-500 hover:text-red-700">
                        No Image - Upload
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            handleUploadExistingImage(
                              item.result_id,
                              e.target.files?.[0],
                            )
                          }
                        />
                      </label>
                    )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-5xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Lab Image Preview
              </h3>

              <button
                onClick={() => setPreviewImage(null)}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <img
              src={previewImage}
              alt="Lab result"
              className="max-h-[75vh] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}