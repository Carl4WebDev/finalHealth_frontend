import { useEffect, useState } from "react";
import { useClinics } from "../../../../context/clinics/useClinics";

export default function AffiliateClinicModal({ isOpen, onClose, doctorId }) {
  const {
    allClinicsOfUser,
    loading,
    getAllClinicsOfUserNotAffiliated,
    createAffiliationDoctorToClinic,
  } = useClinics();

  const [codes, setCodes] = useState({});
  const [submitting, setSubmitting] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getAllClinicsOfUserNotAffiliated(doctorId);
      setCodes({});
      setError(null);
    }
  }, [doctorId, isOpen]);

  const handleCodeChange = (clinicId, value) => {
    setCodes((prev) => ({ ...prev, [clinicId]: value }));
    setError(null);
  };

  const handleAffiliate = async (clinicId) => {
    const code = (codes[clinicId] || "").trim();
    if (!code) return;

    setSubmitting(clinicId);
    setError(null);

    const res = await createAffiliationDoctorToClinic(doctorId, clinicId, code);

    if (res?.ok === false) {
      setError(res.message || "Something went wrong");
      setSubmitting(null);
      return;
    }

    setSubmitting(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Blurred Blue Backdrop */}
      <div
        className="absolute inset-0 bg-blue-50/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-4xl rounded-2xl border-4 border-blue-600 shadow-xl p-6 max-h-[90vh] overflow-y-auto z-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-700">
            Affiliate Clinic
          </h2>

          <button
            onClick={onClose}
            className="text-blue-600 hover:text-blue-800 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700">
          Enter an affiliation code (e.g. contract number, MOA reference) as proof of partnership.
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading clinics…</p>
        ) : allClinicsOfUser.length === 0 ? (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
            No approved clinics available.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-blue-100">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">Clinic Name</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Owner</th>
                  <th className="p-3 text-left">Affiliation Code</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {allClinicsOfUser.map((c) => (
                  <tr
                    key={c.clinic_id}
                    className="border-t hover:bg-blue-50 transition"
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {c.clinic_name}
                    </td>
                    <td className="p-3 text-gray-600">{c.address}</td>
                    <td className="p-3 text-gray-600">{c.owner_name}</td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={codes[c.clinic_id] || ""}
                        onChange={(e) => handleCodeChange(c.clinic_id, e.target.value)}
                        placeholder="Enter code"
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleAffiliate(c.clinic_id)}
                        disabled={!codes[c.clinic_id]?.trim() || submitting === c.clinic_id}
                        className="px-4 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {submitting === c.clinic_id ? "Verifying…" : "Affiliate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
