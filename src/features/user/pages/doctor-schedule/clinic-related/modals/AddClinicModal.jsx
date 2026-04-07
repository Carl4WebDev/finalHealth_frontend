import { useState } from "react";
import { useClinics } from "../../../../context/clinics/useClinics";

export default function AddClinicModal({ isOpen, onClose }) {
  const { createClinic, getAllClinicsOfUser } = useClinics();

  const [formData, setFormData] = useState({
    clinicName: "",
    businessPermitNo: "",
    ownerName: "",
    address: "",
    contactNum: "",
    backupNum: "",
    openHours: "",
    openDays: "",
  });

  const [submitError, setSubmitError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitError("");

    const res = await createClinic({
      clinicName: formData.clinicName,
      businessPermitNo: formData.businessPermitNo,
      ownerName: formData.ownerName,
      address: formData.address,
      contactNum: formData.contactNum,
      backupNum: formData.backupNum || null,
      openHours: formData.openHours,
      openDays: formData.openDays,
    });

    if (!res?.ok) {
      setSubmitError(res?.message || "Something went wrong.");
      return;
    }

    await getAllClinicsOfUser();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-blue-50/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border-4 border-blue-600 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-blue-700">Add Clinic</h2>

          <button
            onClick={onClose}
            className="text-xl font-bold text-blue-600 hover:text-blue-800"
          >
            ×
          </button>
        </div>

        {submitError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <Input
            label="Clinic Name"
            value={formData.clinicName}
            onChange={(v) => handleChange("clinicName", v)}
          />

          <Input
            label="Business Permit No."
            value={formData.businessPermitNo}
            onChange={(v) => handleChange("businessPermitNo", v)}
          />

          <Input
            label="Owner Name"
            value={formData.ownerName}
            onChange={(v) => handleChange("ownerName", v)}
          />

          <Input
            label="Contact Number"
            value={formData.contactNum}
            onChange={(v) => handleChange("contactNum", v)}
          />

          <Input
            label="Backup Contact Number"
            value={formData.backupNum}
            onChange={(v) => handleChange("backupNum", v)}
          />

          <Input
            label="Open Hours (e.g. 9AM - 6PM)"
            value={formData.openHours}
            onChange={(v) => handleChange("openHours", v)}
          />

          <Input
            label="Open Days (e.g. Mon-Fri)"
            value={formData.openDays}
            onChange={(v) => handleChange("openDays", v)}
          />

          <div className="md:col-span-2">
            <label className="font-medium">Address</label>
            <textarea
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-5 py-2 transition hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={
              !formData.clinicName ||
              !formData.businessPermitNo ||
              !formData.ownerName ||
              !formData.contactNum ||
              !formData.openHours ||
              !formData.openDays ||
              !formData.address
            }
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300"
          >
            Save Clinic
          </button>
        </div>
      </div>
    </div>
  );
}

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);