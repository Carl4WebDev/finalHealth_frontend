import { useState } from "react";
import { useDoctors } from "../../../../context/doctors/useDoctors";

export default function AddDoctorModal({ isOpen, onClose }) {
  const { createDoctor } = useDoctors();

  const [formData, setFormData] = useState({
    fName: "",
    mName: "",
    lName: "",
    specialization: "",
    licenseNumber: "",
    yearsExperience: "",
    education: "",
    gender: "Male",
    address: "",
  });

  const [submitError, setSubmitError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitError("");

    const res = await createDoctor({
      fName: formData.fName,
      mName: formData.mName || null,
      lName: formData.lName,
      specialization: formData.specialization,
      licenseNumber: formData.licenseNumber,
      yearsExperience: Number(formData.yearsExperience) || 0,
      education: formData.education,
      gender: formData.gender,
      address: formData.address,
    });

    if (!res?.ok) {
      setSubmitError(res?.message || "Something went wrong.");
      return;
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-blue-50/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border-4 border-blue-600 bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-center text-xl font-semibold text-blue-700">
          Add Doctor
        </h2>

        {submitError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <Input
            label="First Name"
            value={formData.fName}
            onChange={(v) => handleChange("fName", v)}
          />

          <Input
            label="Middle Name"
            value={formData.mName}
            onChange={(v) => handleChange("mName", v)}
          />

          <Input
            label="Last Name"
            value={formData.lName}
            onChange={(v) => handleChange("lName", v)}
          />

          <Input
            label="Specialization"
            value={formData.specialization}
            onChange={(v) => handleChange("specialization", v)}
          />

          <Input
            label="License Number"
            value={formData.licenseNumber}
            onChange={(v) => handleChange("licenseNumber", v)}
          />

          <Input
            label="Years of Experience"
            type="number"
            value={formData.yearsExperience}
            onChange={(v) => handleChange("yearsExperience", v)}
          />

          <Input
            label="Education"
            value={formData.education}
            onChange={(v) => handleChange("education", v)}
          />

          <Select
            label="Gender"
            value={formData.gender}
            onChange={(v) => handleChange("gender", v)}
            options={["Male", "Female"]}
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

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-5 py-2 transition hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={
              !formData.fName ||
              !formData.lName ||
              !formData.specialization ||
              !formData.licenseNumber ||
              !formData.education ||
              !formData.address
            }
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300"
          >
            Save Doctor
          </button>
        </div>
      </div>
    </div>
  );
}

/* Reusable Inputs */
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

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);