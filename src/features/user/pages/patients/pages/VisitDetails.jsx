import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import Layout from "../../../components/Layout.jsx";
import { useMedicalRecords } from "../../../context/medical-records/useMedicalRecords.js";

import MedicalRecordTab from "../components/medical-record/MedicalRecordTab.jsx";
import VitalsTab from "../components/medical-record/VitalsTab";
import PrescriptionTab from "../components/medical-record/PrescriptionTab";
import LabResultsTab from "../components/medical-record/LabResultsTab";
import CertificatesTab from "../components/medical-record/CertificatesTab";
import FeesTab from "../components/medical-record/FeesTab";

export default function VisitDetails() {
  const { patientId, visitId } = useParams();
  const appointmentId = Number(visitId);

  const [activeTab, setActiveTab] = useState("medical-record");

  const {
    medicalRecordByAppointment,
    loadingMedicalRecordByAppointment,
    getMedicalRecordByAppointmentId,
  } = useMedicalRecords();

  useEffect(() => {
    if (appointmentId) {
      getMedicalRecordByAppointmentId(appointmentId);
    }
  }, [appointmentId]);

  const recordId = useMemo(
    () => medicalRecordByAppointment?.record_id || null,
    [medicalRecordByAppointment]
  );

  const tabs = [
    { key: "medical-record", label: "Medical Record" },
    { key: "vitals", label: "Vitals" },
    { key: "prescription", label: "Prescription" },
    { key: "lab-results", label: "Lab Results" },
    { key: "certificates", label: "Certificates" },
    { key: "fees", label: "Fees" },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={`/user/patients/${patientId}`}
            className="inline-block rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
          >
            ← Back to Patient
          </Link>

          <div className="text-sm text-gray-600">
            <span className="font-semibold">Appointment ID:</span> {appointmentId}
            {" • "}
            <span className="font-semibold">Record ID:</span> {recordId || "No medical record yet"}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loadingMedicalRecordByAppointment ? (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
            Loading visit details...
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {activeTab === "medical-record" && (
<MedicalRecordTab
  appointmentId={appointmentId}
  patientId={patientId}
  medicalRecord={medicalRecordByAppointment}
/>
            )}

            {activeTab === "vitals" && (
              <VitalsTab
                recordId={recordId}
                patientId={patientId}
                appointmentId={appointmentId}
              />
            )}

            {activeTab === "prescription" && (
              <PrescriptionTab recordId={recordId} patientId={patientId} />
            )}

            {activeTab === "lab-results" && (
              <LabResultsTab recordId={recordId} patientId={patientId} />
            )}

            {activeTab === "certificates" && (
              <CertificatesTab recordId={recordId} patientId={patientId} />
            )}

            {activeTab === "fees" && (
<FeesTab
  recordId={recordId}
  medicalRecord={medicalRecordByAppointment}
/>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}