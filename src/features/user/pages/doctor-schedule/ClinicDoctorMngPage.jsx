import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../../components/Layout";

import { useDoctors } from "../../context/doctors/useDoctors";
import { useClinics } from "../../context/clinics/useClinics";
import { getDoctorLimitStatusApi, getClinicLimitStatusApi } from "../../api/medicalRecordsApi";

import AddDoctorModal from "./doctor-related/modals/AddDoctorModal";
import AddClinicModal from "./clinic-related/modals/AddClinicModal";

export default function ClinicDoctorMngPage() {
  const { getAllDoctorsOfUser, doctors } = useDoctors();
  const { getAllClinicsOfUser, allClinics, error } = useClinics();

  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddClinicModal, setShowAddClinicModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  useEffect(() => {
    getAllDoctorsOfUser();
  }, []);

  useEffect(() => {
    getAllClinicsOfUser();
  }, []);

  const handleAddDoctorClick = async () => {
    try {
      setModalError("");

      const res = await getDoctorLimitStatusApi();

      if (!res?.ok) {
        setModalError(res?.message || "Failed to check doctor limit.");
        setShowError(true);
        return;
      }

      if (!res?.data?.canAddDoctor) {
        setModalError(
          res?.data?.message ||
            "Your current subscription does not allow adding more doctors."
        );
        setShowError(true);
        return;
      }

      setShowAddDoctor(true);
    } catch (err) {
      setModalError("Failed to check doctor limit.");
      setShowError(true);
    }
  };

  const handleAddClinicClick = async () => {
  try {
    setModalError("");

    const res = await getClinicLimitStatusApi();

    if (!res?.ok) {
      setModalError(res?.message || "Failed to check clinic limit.");
      setShowError(true);
      return;
    }

    if (!res?.data?.canAddClinic) {
      setModalError(
        res?.data?.message ||
          "Your current subscription does not allow adding more clinics."
      );
      setShowError(true);
      return;
    }

    setShowAddClinicModal(true);
  } catch (err) {
    setModalError("Failed to check clinic limit.");
    setShowError(true);
  }
};

  return (
    <Layout>
      {/* SIMPLE ERROR MODAL */}
      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white border-4 border-blue-600 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Action Failed
            </h2>

            <p className="text-gray-600 mb-6">
              {modalError || error || "Something went wrong."}
            </p>

            <button
              onClick={() => setShowError(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      <AddDoctorModal
        isOpen={showAddDoctor}
        onClose={() => setShowAddDoctor(false)}
      />

      <AddClinicModal
        isOpen={showAddClinicModal}
        onClose={() => setShowAddClinicModal(false)}
      />

      <div className="p-6 space-y-8">
        {/* ================= DOCTORS ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-700">Doctors</h2>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleAddDoctorClick}
            >
              + Add Doctor
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="min-w-[600px] w-full border text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left whitespace-nowrap">Doctor Name</th>
                  <th className="p-3 text-left whitespace-nowrap">Specialization</th>
                  <th className="p-3 text-left whitespace-nowrap">License</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map((d) => (
                  <tr
                    key={d.doctor_id}
                    className="border-t hover:bg-blue-50 transition"
                  >
                    <td className="p-3 text-blue-600 font-medium whitespace-nowrap">
                      <Link to={`/user/manage-doctor/${d.doctor_id}`}>
                        Dr. {d.f_name} {d.l_name}
                      </Link>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {d.specialization}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {d.license_number}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= CLINICS ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-700">Clinics</h2>

            <button
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              onClick={handleAddClinicClick}
            >
              + Add Clinic
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="min-w-[500px] w-full border text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left whitespace-nowrap">Clinic Name</th>
                  <th className="p-3 text-left whitespace-nowrap">Address</th>
                </tr>
              </thead>

              <tbody>
                {allClinics.map((c) => (
                  <tr
                    key={c.clinic_id}
                    className="border-t hover:bg-blue-50 transition"
                  >
                    <td className="p-3 whitespace-nowrap">
                      <Link
                        to={`/user/manage-clinic/${c.clinic_id}`}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        {c.clinic_name}
                      </Link>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {c.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}