import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMedicalRecords } from "../../../../context/medical-records/useMedicalRecords.js";
import { useCertificateMaster } from "../../../../context/certificate-master/useCertificateMaster.js";
import { AddTextModal, CERTIFICATE_STANDARD_OPTIONS } from "../shared/AddItemModal.jsx";

const API_BASE = import.meta.env.VITE_API_BASE;

const REMARK_OPTIONS = [
  "Patient is fit to resume work.",
  "Patient advised to rest for 3 days.",
  "Pending final clearance after lab review.",
  "Cleared after physical examination.",
];

export default function CertificatesTab({ recordId, patientId }) {
  const navigate = useNavigate();

  const {
    certificates,
    loadingCertificates,
    getCertificatesByRecord,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    updateCertificateImage,
  } = useMedicalRecords();

  const { certificates: certificateOptions, getAllCertificateMasters, createCertificateMaster } =
    useCertificateMaster();

  const [isAddCertificateOpen, setIsAddCertificateOpen] = useState(false);

  const [form, setForm] = useState({
    certificate_type: "",
    remarks: "",
    certificates_img_path: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [editForm, setEditForm] = useState({
    certificate_type: "",
    remarks: "",
    certificates_img_path: "",
  });

  const certificateTypeOptions = certificateOptions.map(
    (item) => item.certificate_name
  );

  useEffect(() => {
    getAllCertificateMasters();
  }, []);

  useEffect(() => {
    if (recordId) {
      getCertificatesByRecord(recordId);
    }
  }, [recordId]);

  const formatDate = (dateValue) => {
    if (!dateValue) return new Date().toLocaleDateString();
    return new Date(dateValue).toLocaleDateString();
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE}${imagePath}`;
  };

  const handleCreate = async () => {
    if (!recordId || !form.certificate_type) return;

    const res = await createCertificate(recordId, {
      patient_id: patientId,
      ...form,
    });

    if (res?.ok !== false) {
      setForm({
        certificate_type: "",
        remarks: "",
        certificates_img_path: "",
      });

      await getCertificatesByRecord(recordId);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.certificates_id);
    setEditForm({
      certificate_type: item.certificate_type || "",
      remarks: item.remarks || "",
      certificates_img_path: item.certificates_img_path || "",
    });
  };

  const handleUpdate = async (certificateId) => {
    const res = await updateCertificate(certificateId, {
      patient_id: patientId,
      ...editForm,
    });

    if (res?.ok !== false) {
      setEditingId(null);
      await getCertificatesByRecord(recordId);
    }
  };

  const handleDelete = async (certificateId) => {
    const res = await deleteCertificate(certificateId);

    if (res?.ok !== false) {
      await getCertificatesByRecord(recordId);
    }
  };

  const handleUploadExistingImage = async (certificateId, file) => {
    if (!file) return;

    const res = await updateCertificateImage(certificateId, recordId, file);

    if (res?.ok !== false) {
      await getCertificatesByRecord(recordId);
    }
  };

  const handleViewImage = (imagePath) => {
    if (!imagePath) return;
    setPreviewImage(getImageUrl(imagePath));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Certificates</h2>

      <div className="rounded-xl bg-gray-50 p-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex gap-2">
            <select
              value={form.certificate_type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  certificate_type: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select Certificate Type</option>

              {certificateTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setIsAddCertificateOpen(true)}
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
              title="Manage certificate options"
            >
              +
            </button>
          </div>

          <input
            list="remark-options"
            value={form.remarks}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, remarks: e.target.value }))
            }
            placeholder="Select or type remarks"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <datalist id="remark-options">
            {REMARK_OPTIONS.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </div>

        <button
          onClick={handleCreate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add Certificate
        </button>
      </div>

      {loadingCertificates ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          Loading certificates...
        </div>
      ) : !certificates?.length ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          No certificates found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Certificate Type
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Remarks
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
              {certificates.map((item, index) => (
                <tr
                  key={item.certificates_id}
                  className={
                    index !== certificates.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }
                >
                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {editingId === item.certificates_id ? (
                      <select
                        value={editForm.certificate_type}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            certificate_type: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="">Select Certificate Type</option>

                        {certificateTypeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.certificate_type
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {editingId === item.certificates_id ? (
                      <>
                        <input
                          list="edit-remark-options"
                          value={editForm.remarks}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              remarks: e.target.value,
                            }))
                          }
                          placeholder="Select or type remarks"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />

                        <datalist id="edit-remark-options">
                          {REMARK_OPTIONS.map((option) => (
                            <option key={option} value={option} />
                          ))}
                        </datalist>
                      </>
                    ) : (
                      item.remarks || "-"
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-sm">
                    {item.certificates_img_path ? (
                      <button
                        onClick={() =>
                          handleViewImage(item.certificates_img_path)
                        }
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
                              item.certificates_id,
                              e.target.files?.[0]
                            )
                          }
                        />
                      </label>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {formatDate(item.created_at)}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {editingId === item.certificates_id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(item.certificates_id)}
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
                            onClick={() => handleDelete(item.certificates_id)}
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
                Certificate Image Preview
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
              alt="Certificate"
              className="max-h-[75vh] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}

      <AddTextModal
        isOpen={isAddCertificateOpen}
        title="Add Certificate Type"
        placeholder="Choose or type certificate"
        onClose={() => setIsAddCertificateOpen(false)}
        onSubmit={async (value) => {
          const res = await createCertificateMaster(value);
          if (res?.ok !== false) {
            await getAllCertificateMasters();
            return true;
          }
          return false;
        }}
        categorizedOptions={CERTIFICATE_STANDARD_OPTIONS}
      />
    </div>
  );
}