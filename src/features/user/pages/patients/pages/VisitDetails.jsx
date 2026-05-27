import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import Layout from "../../../components/Layout.jsx";
import { useMedicalRecords } from "../../../context/medical-records/useMedicalRecords.js";
import { usePatients } from "../../../context/patients/usePatients.js";

import MedicalRecordTab from "../components/medical-record/MedicalRecordTab.jsx";
import VitalsTab from "../components/medical-record/VitalsTab";
import PrescriptionTab from "../components/medical-record/PrescriptionTab";
import LabResultsTab from "../components/medical-record/LabResultsTab";
import CertificatesTab from "../components/medical-record/CertificatesTab";
import FeesTab from "../components/medical-record/FeesTab";
import PatientInfoSidebar from "../components/medical-record/PatientInfoSidebar.jsx";

export default function VisitDetails() {
  const { patientId, visitId } = useParams();
  const appointmentId = Number(visitId);

  const [activeTab, setActiveTab] = useState("medical-record");
  const [emailDate, setEmailDate] = useState("");
  const [emailNote, setEmailNote] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const {
    medicalRecordByAppointment,
    loadingMedicalRecordByAppointment,
    getMedicalRecordByAppointmentId,
    patientsInfo,
    getPatientInfo,
  } = useMedicalRecords();

  const { uploadPatientImage } = usePatients();

  useEffect(() => {
    if (appointmentId) {
      getMedicalRecordByAppointmentId(appointmentId);
    }
    if (patientId) {
      getPatientInfo(patientId);
    }
  }, [appointmentId, patientId]);

  const handleUploadPatientImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const success = await uploadPatientImage(patientId, file);
    if (success) {
      await getPatientInfo(patientId);
    }
    e.target.value = "";
  };

  const recordId = useMemo(
    () => medicalRecordByAppointment?.record_id || null,
    [medicalRecordByAppointment]
  );

  const requiresRecord = [
    "vitals",
    "prescription",
    "lab-results",
    "certificates",
    "fees",
  ];

  const handleSendPatientEmail = async () => {
    if (!emailDate || !emailNote.trim()) {
      alert("Please fill in both the date and note fields.");
      return;
    }
    if (!patientsInfo?.email) {
      alert("Patient has no email on file.");
      return;
    }

    setIsSendingEmail(true);

    const SERVICE_ID = "service_d4wyl2e";
    const TEMPLATE_ID = "template_ra5y0ek";
    const PUBLIC_KEY = "ZHn8_FBOZfQ8daVBK";

    const formattedDate = new Date(emailDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: {
            user_email: patientsInfo.email,
            user_name: patientsInfo.full_name,
            subject: `Visit Follow-Up — ${formattedDate}`,
            message: `Dear ${patientsInfo.full_name},\n\nDate: ${formattedDate}\n\n${emailNote}\n\nThank you,\nFinalHealth`,
          },
        }),
      });

      if (response.ok) {
        alert(`Email sent to ${patientsInfo.email}`);
        setEmailDate("");
        setEmailNote("");
        setShowEmailForm(false);
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (err) {
      console.error("EmailJS Error:", err);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleTabClick = (tabKey) => {
    if (!recordId && requiresRecord.includes(tabKey)) {
      setActiveTab("medical-record");
      return;
    }

    setActiveTab(tabKey);
  };

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
            <span className="font-semibold">Appointment ID:</span>{" "}
            {appointmentId}
            {" • "}
            <span className="font-semibold">Record ID:</span>{" "}
            {recordId || "No medical record yet"}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isLocked = !recordId && requiresRecord.includes(tab.key);

            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : isLocked
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {loadingMedicalRecordByAppointment ? (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
            Loading visit details...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* LEFT — Tab Content */}
            <div className="space-y-6">
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

            {/* RIGHT — Patient Info Sidebar */}
            <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
              <PatientInfoSidebar
                patientInfo={patientsInfo}
                onUploadImage={handleUploadPatientImage}
              />

              {/* Send Email to Patient Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-800">Send Email to Patient</h3>
                  <button
                    onClick={() => setShowEmailForm(!showEmailForm)}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                  >
                    {showEmailForm ? "×" : "+"}
                  </button>
                </div>

                {!showEmailForm ? (
                  <button
                    onClick={() => setShowEmailForm(true)}
                    className="w-full rounded-xl bg-[#2133ff] px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Compose Email
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                      <input
                        type="date"
                        value={emailDate}
                        onChange={(e) => setEmailDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2133ff] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Note</label>
                      <textarea
                        value={emailNote}
                        onChange={(e) => setEmailNote(e.target.value)}
                        placeholder="Enter a note for the patient..."
                        rows="4"
                        className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2133ff] focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Preview */}
                    {emailDate && emailNote && (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Preview</p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">To:</span> {patientsInfo?.email || "No email"}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Subject:</span> Visit Follow-Up — {new Date(emailDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                        <p className="mt-1 text-xs text-gray-700 whitespace-pre-wrap">{emailNote}</p>
                      </div>
                    )}

                    <button
                      onClick={handleSendPatientEmail}
                      disabled={isSendingEmail || !emailDate || !emailNote.trim()}
                      className={`w-full rounded-xl px-4 py-2 text-sm font-medium text-white transition flex items-center justify-center gap-2 ${
                        isSendingEmail || !emailDate || !emailNote.trim()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#2133ff] hover:bg-blue-700"
                      }`}
                    >
                      {isSendingEmail ? (
                        "Sending..."
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Send Email
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}