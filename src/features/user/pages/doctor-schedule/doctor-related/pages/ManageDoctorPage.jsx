import { useEffect, useState } from "react";
import Layout from "../../../../components/Layout";

import { useDoctors } from "../../../../context/doctors/useDoctors";
import { useClinics } from "../../../../context/clinics/useClinics";
import { useDoctorSessions } from "../../../../context/doctor-sessions/useDoctorSessions";

import EditDoctorModal from "../modals/EditDoctorModal";
import AffiliateClinicModal from "../modals/AffiliateClinicModal";
import CreateDoctorSessionModal from "../modals/CreateDoctorSessionModal";

import { useNavigate, useParams } from "react-router-dom";

export default function ManageDoctorPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [showEdit, setShowEdit] = useState(false);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);

  const {
    doctors,
    loading: doctorsLoading,
    getAllDoctorsOfUser,
  } = useDoctors();

  const {
    clinics,
    loading: clinicsLoading,
    getAllClinicsOfDoctor,
    deleteClinicAffiliation,
  } = useClinics();

  const {
    allDoctorSessions,
    getAllDoctorSessions,
    loading: doctorSessionsLoading,
    deleteSession,
  } = useDoctorSessions();

  /* ================= FETCH DATA ================= */

  // Fetch doctors if not loaded
  useEffect(() => {
    if (doctors.length === 0) {
      getAllDoctorsOfUser();
    }
  }, []);

  // Fetch clinics for this doctor
  useEffect(() => {
    if (doctorId) {
      getAllClinicsOfDoctor(Number(doctorId));
    }
  }, [doctorId]);

  // Fetch all sessions of this doctor (all clinics)
  useEffect(() => {
    if (doctorId) {
      getAllDoctorSessions(Number(doctorId));
    }
  }, [doctorId]);

  const handleDelete = async (sessionId) => {
    await deleteSession(sessionId);
    await getAllDoctorSessions(doctorId);
  };

  const handleUnaffiliate = async (doctorId, clinicId) => {
    // alert(`${doctorId} - ${clinicId}`);
    await deleteClinicAffiliation(doctorId, clinicId);
    await getAllClinicsOfDoctor(doctorId);
    await getAllDoctorSessions(doctorId);
  };

  /* ================= DERIVED DATA ================= */

  const doctor = doctors.find((d) => d.doctor_id === Number(doctorId));

  /* ================= STATES ================= */

  if (doctorsLoading || clinicsLoading) {
    return (
      <Layout>
        <p className="p-6">Loading…</p>
      </Layout>
    );
  }

  if (!doctor) {
    return (
      <Layout>
        <div className="p-6">
          <p className="text-red-600">Doctor not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  /* ================= UI ================= */

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <EditDoctorModal
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          doctorId={doctorId}
        />
        <CreateDoctorSessionModal
          isOpen={showCreateSessionModal}
          onClose={() => setShowCreateSessionModal(false)}
          doctorId={doctorId}
        />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back
        </button>

        {/* ================= DOCTOR INFO ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-700">
              Doctor Information
            </h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowEdit(true)}
            >
              Edit Info
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p>
              <b>Name:</b> Dr. {doctor.f_name} {doctor.m_name} {doctor.l_name}
            </p>
            <p>
              <b>Specialization:</b> {doctor.specialization}
            </p>
            <p>
              <b>License:</b> {doctor.license_number}
            </p>
            <p>
              <b>Gender:</b> {doctor.gender}
            </p>
            <p>
              <b>Experience:</b> {doctor.years_experience} years
            </p>
            <p>
              <b>Education:</b> {doctor.education}
            </p>
            <p>
              <b>Address:</b> {doctor.address}
            </p>
          </div>
        </div>

        <AffiliateClinicModal
          isOpen={showAffiliateModal}
          onClose={() => setShowAffiliateModal(false)}
          doctorId={doctorId}
        />

        {/* ================= AFFILIATED CLINICS ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-blue-700">Affiliated Clinics</h3>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAffiliateModal(true)}
            >
              + Affiliate Clinic
            </button>
          </div>

          {clinics.length === 0 ? (
            <p className="text-sm text-gray-500">No affiliated clinics.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1000px] w-full border text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-2 text-left whitespace-nowrap">Clinic Name</th>
                    <th className="p-2 text-left whitespace-nowrap">Address</th>
                    <th className="p-2 text-left whitespace-nowrap">Contact</th>
                    <th className="p-2 text-left whitespace-nowrap">Open Hours</th>
                    <th className="p-2 text-left whitespace-nowrap">Open Days</th>
                    <th className="p-2 text-left whitespace-nowrap">Owner</th>
                    <th className="p-2 text-left whitespace-nowrap">Affiliation Code</th>
                    <th className="p-2 text-left whitespace-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {clinics.map((c) => (
                    <tr key={c.clinic_id} className="border-t hover:bg-blue-50">
                      <td className="p-2 whitespace-nowrap">{c.clinic_name}</td>
                      <td className="p-2 whitespace-nowrap">{c.address}</td>
                      <td className="p-2 whitespace-nowrap">{c.contact_num}</td>
                      <td className="p-2 whitespace-nowrap">{c.open_hours}</td>
                      <td className="p-2 whitespace-nowrap">{c.open_days}</td>
                      <td className="p-2 whitespace-nowrap">{c.owner_name}</td>
                      <td className="p-2 whitespace-nowrap font-mono text-xs text-gray-500">{c.affiliation_code || "—"}</td>

                      <td className="p-2 whitespace-nowrap">
                        <button
                          type="button"
                          className="px-2 py-1 rounded text-xs bg-red-100 text-red-600 hover:bg-red-200 transition"
                          onClick={() => handleUnaffiliate(doctorId, c.clinic_id)}
                        >
                          Unaffiliate Clinic
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          )}
        </div>

        {/* ================= SESSIONS ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-blue-700">Doctor Sessions</h3>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowCreateSessionModal(true)}
            >
              + Add Session
            </button>
          </div>

          {doctorSessionsLoading ? (
            <p className="text-sm text-gray-500">Loading sessions…</p>
          ) : allDoctorSessions.length === 0 ? (
            <p className="text-sm text-gray-500">No sessions found.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[900px] w-full border text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-2 text-left whitespace-nowrap">Day</th>
                    <th className="p-2 text-left whitespace-nowrap">Clinic</th>
                    <th className="p-2 text-left whitespace-nowrap">Session</th>
                    <th className="p-2 text-left whitespace-nowrap">Start Time</th>
                    <th className="p-2 text-left whitespace-nowrap">End Time</th>
                    <th className="p-2 text-left whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {allDoctorSessions.map((s) => (
                    <tr key={s.session_id} className="border-t hover:bg-blue-50">
                      <td className="p-2 whitespace-nowrap">{s.day_of_week}</td>
                      <td className="p-2 whitespace-nowrap">{s.clinic_name}</td>
                      <td className="p-2 whitespace-nowrap">{s.session_period}</td>
                      <td className="p-2 whitespace-nowrap">{s.start_time}</td>
                      <td className="p-2 whitespace-nowrap">{s.end_time}</td>
                      <td className="p-2 whitespace-nowrap">
                        <button
                          type="button"
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                          onClick={() => handleDelete(s.session_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          )}
        </div>
      </div>
    </Layout>
  );
}
