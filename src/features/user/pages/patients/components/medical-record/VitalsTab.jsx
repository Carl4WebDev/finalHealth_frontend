import { useEffect, useState } from "react";
import { useMedicalRecords } from "../../../../context/medical-records/useMedicalRecords.js";

const BLOOD_PRESSURE_OPTIONS = ["110/70", "120/80", "130/90", "140/90"];
const HEART_RATE_OPTIONS = [60, 72, 80, 90];
const TEMPERATURE_OPTIONS = ["36.5", "36.8", "37.0", "37.5"];
const OXYGEN_OPTIONS = [95, 96, 97, 98, 99];
const WEIGHT_OPTIONS = [45, 50, 55, 60, 65, 70];

export default function VitalsTab({ patientId, recordId }) {
  const {
    patientVitalSigns,
    loadingPatientVitalSigns,
    getPatientVitalSigns,
    createVitalSign,
  } = useMedicalRecords();

  const [form, setForm] = useState({
    appointmentId: recordId,
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    oxygenSaturation: "",
    weight: "",
    medicalRecordId: recordId,
  });

  useEffect(() => {
    if (patientId) {
      getPatientVitalSigns(patientId);
    }
  }, []);

  const handleCreate = async () => {
    const res = await createVitalSign(patientId, form);

    if (res?.ok !== false) {
      setForm({
        appointmentId: recordId,
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        oxygenSaturation: "",
        weight: "",
        medicalRecordId: recordId,
      });
      getPatientVitalSigns(patientId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Vitals</h2>

      <div className="rounded-xl bg-gray-50 p-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-5">
          <select
            value={form.bloodPressure}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, bloodPressure: e.target.value }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Blood Pressure</option>
            {BLOOD_PRESSURE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={form.heartRate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, heartRate: e.target.value }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Heart Rate</option>
            {HEART_RATE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={form.temperature}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, temperature: e.target.value }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Temperature</option>
            {TEMPERATURE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={form.oxygenSaturation}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, oxygenSaturation: e.target.value }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Oxygen</option>
            {OXYGEN_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={form.weight}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, weight: e.target.value }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Weight</option>
            {WEIGHT_OPTIONS.map((option) => (
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
          Add Vital Signs
        </button>
      </div>

      {loadingPatientVitalSigns ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          Loading vital signs...
        </div>
      ) : !patientVitalSigns?.length ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          No vital signs found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">BP</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">HR</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Temp</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Oxygen</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Weight</th>
              </tr>
            </thead>
            <tbody>
              {patientVitalSigns.map((item, index) => (
                <tr
                  key={item.vital_id}
                  className={index !== patientVitalSigns.length - 1 ? "border-b border-gray-200" : ""}
                >
                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {item.blood_pressure || "-"}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {item.heart_rate || "-"}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {item.temperature || "-"}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {item.oxygen_saturation || "-"}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {item.weight || "-"}
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