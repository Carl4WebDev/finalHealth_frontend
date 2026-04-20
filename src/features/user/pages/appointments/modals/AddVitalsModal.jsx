import { useEffect, useMemo, useState } from "react";
import { useMedicalRecords } from "../../../context/medical-records/useMedicalRecords";

const initialForm = {
  bloodPressure: "",
  heartRate: "",
  temperature: "",
  oxygenSaturation: "",
  weight: "",
};

export default function AddVitalsModal({
  isOpen,
  onClose,
  patient = null,
  appointmentId = "",
  onSuccess,
}) {
  const { createVitalSign, loadingCreateVitalSign } = useMedicalRecords();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const patientName = useMemo(() => {
    if (!patient) return "Selected Patient";

    return (
      patient.fullName ||
      patient.name ||
      [
        patient.patient_f_name || patient.fName,
        patient.patient_m_name || patient.mName,
        patient.patient_l_name || patient.lName,
      ]
        .filter(Boolean)
        .join(" ") ||
      "Selected Patient"
    );
  }, [patient]);

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setErrors({});
      setSubmitError("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!appointmentId) {
      newErrors.appointmentId = "Appointment ID is required.";
    }

    if (!form.bloodPressure.trim()) {
      newErrors.bloodPressure = "Blood pressure is required.";
    }

    if (!form.heartRate.trim()) {
      newErrors.heartRate = "Heart rate is required.";
    }

    if (!form.temperature.trim()) {
      newErrors.temperature = "Temperature is required.";
    }

    if (!form.oxygenSaturation.trim()) {
      newErrors.oxygenSaturation = "Oxygen saturation is required.";
    }

    if (!form.weight.trim()) {
      newErrors.weight = "Weight is required.";
    }

    return newErrors;
  };

  const buildPayload = () => {
    return {
      appointmentId: Number(appointmentId),
      patientId: patient?.patient_id || patient?.patientId || patient?.id || null,
      bloodPressure: form.bloodPressure.trim(),
      heartRate: Number(form.heartRate),
      temperature: form.temperature.trim(),
      oxygenSaturation: Number(form.oxygenSaturation),
      weight: Number(form.weight),
      medicalRecordId: null,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = buildPayload();
    const patientId = payload.patientId;

    if (!patientId) {
      setSubmitError("Patient ID is missing.");
      return;
    }

    const res = await createVitalSign(patientId, payload);

    if (!res?.ok) {
      setSubmitError(res?.message || "Failed to save vital signs.");
      return;
    }

    if (onSuccess) {
      onSuccess(res);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add Vital Signs
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter the patient&apos;s vital signs.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[85vh] overflow-y-auto">
          <div className="space-y-6 px-5 py-5">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Patient:</span> {patientName}
              </p>
            </div>

            {submitError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            )}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-700">
                Appointment
              </h3>

              <div className="w-full">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Appointment ID
                </label>

                <div className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-700">
                  {appointmentId || "N/A"}
                </div>

                {errors.appointmentId && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.appointmentId}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-slate-50 p-4">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-700">
                Vital Signs
              </h3>

              <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-[calc(50%-0.5rem)]">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Blood Pressure <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={form.bloodPressure}
                    onChange={handleChange}
                    placeholder="120/80"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                      errors.bloodPressure
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {errors.bloodPressure && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.bloodPressure}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-[calc(50%-0.5rem)]">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Heart Rate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="heartRate"
                    value={form.heartRate}
                    onChange={handleChange}
                    placeholder="72"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                      errors.heartRate
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {errors.heartRate && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.heartRate}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-[calc(50%-0.5rem)]">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Temperature (°C) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="temperature"
                    value={form.temperature}
                    onChange={handleChange}
                    placeholder="36.5"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                      errors.temperature
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {errors.temperature && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.temperature}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-[calc(50%-0.5rem)]">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Oxygen Saturation (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="oxygenSaturation"
                    value={form.oxygenSaturation}
                    onChange={handleChange}
                    placeholder="98"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                      errors.oxygenSaturation
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {errors.oxygenSaturation && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.oxygenSaturation}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-[calc(50%-0.5rem)]">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="65"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                      errors.weight
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {errors.weight && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.weight}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loadingCreateVitalSign}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingCreateVitalSign ? "Saving..." : "Save Vital Signs"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}