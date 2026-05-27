import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";

import Layout from "../../../components/Layout.jsx";
import { useMedicalRecords } from "../../../context/medical-records/useMedicalRecords.js";
import { usePatients } from "../../../context/patients/usePatients.js";
import { apiRequest } from "../../../../../api/httpClient/httpClient.js";

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
    getMedicalRecordsFullDetails,
    medicalRecordsFullDetails,
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

  const recordId = useMemo(
    () => medicalRecordByAppointment?.record_id || null,
    [medicalRecordByAppointment]
  );

  useEffect(() => {
    if (recordId) {
      getMedicalRecordsFullDetails(recordId);
    }
  }, [recordId]);

  const handleUploadPatientImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const success = await uploadPatientImage(patientId, file);
    if (success) {
      await getPatientInfo(patientId);
    }
    e.target.value = "";
  };

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

  // ─── helpers ────────────────────────────────────────────
  const fmtPdf = (v) =>
    `PHP ${Number(v || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const computeAge = (dob) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const fmtDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ─── Generate Full Medical Record PDF ────────────────────
  const generateFullPdf = async () => {
    if (!recordId) return;

    // Fetch clinic + doctor info
    let clinic = null;
    let doctor = null;
    if (medicalRecordByAppointment?.clinic_id) {
      const res = await apiRequest(`/api/clinic-routes/clinic/${medicalRecordByAppointment.clinic_id}/clinic-info`);
      if (res?.ok) {
        const rows = Array.isArray(res.data) ? res.data : [res.data];
        clinic = rows[0] || null;
      }
    }
    if (medicalRecordByAppointment?.doctor_id) {
      const res = await apiRequest(`/api/doctor-routes/doctor-informations/${medicalRecordByAppointment.doctor_id}`);
      if (res?.ok) {
        const rows = Array.isArray(res.data) ? res.data : [res.data];
        doctor = rows[0] || null;
      }
    }

    const clinicName = clinic?.clinic_name || "FinalHealth Clinic";
    const clinicAddress = clinic?.address || "";
    const clinicContact = clinic?.contact_num || "";
    const clinicPermit = clinic?.business_permit_no || "";

    const doctorName = doctor
      ? `Dr. ${doctor.f_name || ""} ${doctor.m_name || ""} ${doctor.l_name || ""}`.replace(/\s+/g, " ").trim()
      : "-";
    const doctorSpec = doctor?.specialization || "-";
    const doctorLicense = doctor?.license_number || "-";

    const mr = medicalRecordsFullDetails || {};
    const vitals = mr.vitalSigns || [];
    const prescriptions = mr.prescriptions || [];
    const labResults = mr.labResults || [];
    const certificates = mr.certificates || [];

    const rec = medicalRecordByAppointment || {};
    const patient = patientsInfo || {};
    const patientName = patient?.full_name || "-";
    const patientAge = computeAge(patient?.date_of_birth);
    const patientGender = patient?.gender || "-";
    const patientAddress = patient?.address || "-";
    const patientContact = patient?.contact_number || "-";

    // Fees
    let feesList = [];
    if (rec.record_fees && rec.record_fees.length > 0) {
      feesList = rec.record_fees;
    } else {
      if (Number(rec.consultation_fee || 0) > 0) feesList.push({ feeType: "Consultation Fee", amount: Number(rec.consultation_fee) });
      if (Number(rec.medicine_fee || 0) > 0) feesList.push({ feeType: "Medication Fee", amount: Number(rec.medicine_fee) });
      if (Number(rec.lab_fee || 0) > 0) feesList.push({ feeType: "Lab Fee", amount: Number(rec.lab_fee) });
      if (Number(rec.other_fee || 0) > 0) feesList.push({ feeType: "Other Fee", amount: Number(rec.other_fee) });
    }
    const totalAmount = feesList.reduce((sum, f) => sum + Number(f.amount || 0), 0);

    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const marginL = 14;
    const marginR = pageW - 14;
    const contentW = marginR - marginL;
    let y = 20;

    // ── page helper ──
    const checkPage = (needed = 20) => {
      if (y + needed > pageH - 30) {
        doc.addPage();
        y = 20;
      }
    };

    const sectionHeader = (title) => {
      checkPage(16);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 64, 175);
      doc.text(title, marginL, y);
      y += 2;
      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.4);
      doc.line(marginL, y, marginR, y);
      y += 7;
      doc.setTextColor(0);
    };

    const labelValue = (label, value, opts = {}) => {
      checkPage(6);
      const { indent = 0 } = opts;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.text(`${label}:`, marginL + indent, y);
      doc.setFont("Helvetica", "normal");
      const val = String(value ?? "-");
      // handle long text wrapping
      const lines = doc.splitTextToSize(val, contentW - 45 - indent);
      doc.text(lines, marginL + 40 + indent, y);
      y += lines.length * 5;
    };

    // ── clinic header ──
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 64, 175);
    doc.text(clinicName, pageW / 2, y, { align: "center" });
    y += 6;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100);
    if (clinicAddress) {
      doc.text(clinicAddress, pageW / 2, y, { align: "center" });
      y += 4;
    }
    if (clinicContact) {
      doc.text(`Tel: ${clinicContact}`, pageW / 2, y, { align: "center" });
      y += 4;
    }
    if (clinicPermit) {
      doc.text(`Business Permit No: ${clinicPermit}`, pageW / 2, y, { align: "center" });
      y += 4;
    }
    doc.setTextColor(0);

    // ── divider ──
    y += 2;
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.8);
    doc.line(marginL, y, marginR, y);
    y += 8;

    // ── title ──
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("MEDICAL RECORD SUMMARY", pageW / 2, y, { align: "center" });
    y += 8;

    // ── record meta ──
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Record #: FH-${String(rec.record_id || 0).padStart(5, "0")}`, marginL, y);
    doc.text(`Date: ${fmtDate(rec.record_date || rec.created_at)}`, marginR, y, { align: "right" });
    y += 10;

    // ── patient info ──
    sectionHeader("PATIENT INFORMATION");
    labelValue("Name", patientName);
    labelValue("Age / Gender", `${patientAge} / ${patientGender}`);
    labelValue("Address", patientAddress);
    labelValue("Contact", patientContact);
    y += 3;

    // ── doctor info ──
    sectionHeader("ATTENDING PHYSICIAN");
    labelValue("Doctor", doctorName);
    labelValue("Specialization", doctorSpec);
    labelValue("License No", doctorLicense);
    y += 3;

    // ── medical record ──
    sectionHeader("MEDICAL RECORD");
    labelValue("Diagnosis", rec.diagnosis || "-");
    labelValue("Treatment", rec.treatment || "-");
    labelValue("Medications", rec.medications || "-");
    labelValue("Assessment", rec.assessment || "-");
    if (rec.is_contagious) {
      labelValue("Contagious", "Yes");
      if (rec.contagious_description) labelValue("Details", rec.contagious_description);
    }
    y += 3;

    // ── consultation / pre-employment data ──
    const SKIP_KEYS = new Set(["filledBy", "section", "doctorEvaluation"]);
    const formatLabel = (key) =>
      key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase()).trim();

    const unwrapData = (raw) => {
      if (!raw) return null;
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      const keys = Object.keys(data);
      if (keys.length === 1 && typeof data[keys[0]] === "object" && !Array.isArray(data[keys[0]])) {
        return data[keys[0]];
      }
      return data;
    };

    const formType = (rec.form_type || "general").toLowerCase();
    const isPreEmployment = formType.includes("pre_employment") || formType.includes("pre-employment");
    const rawFormData = isPreEmployment ? rec.pre_employment_data : rec.form_data;
    const formData = unwrapData(rawFormData);

    if (formData) {
      sectionHeader(isPreEmployment ? "PRE-EMPLOYMENT DATA" : "CONSULTATION DATA");

      const entries = Object.entries(formData).filter(([k]) => !SKIP_KEYS.has(k));
      entries.forEach(([key, value]) => {
        const label = formatLabel(key);

        if (Array.isArray(value)) {
          checkPage(8);
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(9);
          doc.text(`${label}:`, marginL, y);
          y += 5;
          doc.setFont("Helvetica", "normal");
          const items = value.map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v)));
          const listText = items.join(", ");
          const lines = doc.splitTextToSize(listText, contentW - 10);
          doc.text(lines, marginL + 5, y);
          y += lines.length * 5;
          return;
        }

        if (typeof value === "object" && value !== null) {
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(9);
          checkPage(8);
          doc.setTextColor(30, 64, 175);
          doc.text(label, marginL, y);
          doc.setTextColor(0);
          y += 5;
          Object.entries(value).forEach(([k, v]) => {
            if (v === null || v === "" || v === undefined) return;
            labelValue(formatLabel(k), typeof v === "object" ? JSON.stringify(v) : String(v), { indent: 5 });
          });
          return;
        }

        labelValue(label, String(value ?? "-"));
      });

      // Doctor Evaluation sub-object
      if (formData.doctorEvaluation && typeof formData.doctorEvaluation === "object") {
        checkPage(12);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(16, 185, 129);
        doc.text("Doctor Evaluation", marginL, y);
        doc.setTextColor(0);
        y += 5;
        Object.entries(formData.doctorEvaluation).forEach(([k, v]) => {
          if (k === "evaluatedAt" || v === null || v === "" || v === undefined) return;
          labelValue(formatLabel(k), String(v), { indent: 5 });
        });
      }

      y += 3;
    }

    // ── vital signs ──
    if (vitals.length > 0) {
      sectionHeader("VITAL SIGNS");

      // table header
      checkPage(12);
      doc.setFillColor(30, 64, 175);
      doc.rect(marginL, y - 4, contentW, 8, "F");
      doc.setTextColor(255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      const vitalCols = [
        { label: "Date", x: marginL + 2, w: 35 },
        { label: "BP", x: marginL + 38, w: 25 },
        { label: "HR", x: marginL + 64, w: 20 },
        { label: "Temp", x: marginL + 85, w: 22 },
        { label: "O2", x: marginL + 108, w: 20 },
        { label: "Weight", x: marginL + 129, w: 25 },
      ];
      vitalCols.forEach((c) => doc.text(c.label, c.x, y));
      y += 8;

      doc.setTextColor(0);
      doc.setFont("Helvetica", "normal");
      vitals.forEach((v, i) => {
        checkPage(6);
        if (i % 2 === 0) {
          doc.setFillColor(245, 247, 250);
          doc.rect(marginL, y - 4, contentW, 6, "F");
        }
        doc.text(fmtDate(v.created_at).substring(0, 12), marginL + 2, y);
        doc.text(v.blood_pressure || "-", marginL + 38, y);
        doc.text(String(v.heart_rate ?? "-"), marginL + 64, y);
        doc.text(String(v.temperature ?? "-"), marginL + 85, y);
        doc.text(String(v.oxygen_saturation ?? "-"), marginL + 108, y);
        doc.text(v.weight ? `${v.weight} kg` : "-", marginL + 129, y);
        y += 6;
      });
      y += 3;
    }

    // ── prescriptions ──
    if (prescriptions.length > 0) {
      sectionHeader("PRESCRIPTIONS");

      checkPage(12);
      doc.setFillColor(30, 64, 175);
      doc.rect(marginL, y - 4, contentW, 8, "F");
      doc.setTextColor(255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("#", marginL + 2, y);
      doc.text("Medication", marginL + 12, y);
      doc.text("Dosage", marginL + 60, y);
      doc.text("Frequency", marginL + 90, y);
      doc.text("Duration", marginL + 125, y);
      y += 8;

      doc.setTextColor(0);
      doc.setFont("Helvetica", "normal");
      prescriptions.forEach((p, i) => {
        checkPage(6);
        if (i % 2 === 0) {
          doc.setFillColor(245, 247, 250);
          doc.rect(marginL, y - 4, contentW, 6, "F");
        }
        doc.text(String(i + 1), marginL + 2, y);
        doc.text(p.medication_name || "-", marginL + 12, y);
        doc.text(p.dosage || "-", marginL + 60, y);
        doc.text(p.frequency || "-", marginL + 90, y);
        doc.text(p.duration || "-", marginL + 125, y);
        y += 6;
      });
      y += 3;
    }

    // ── lab results ──
    if (labResults.length > 0) {
      sectionHeader("LAB RESULTS");

      checkPage(12);
      doc.setFillColor(30, 64, 175);
      doc.rect(marginL, y - 4, contentW, 8, "F");
      doc.setTextColor(255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("#", marginL + 2, y);
      doc.text("Test Type", marginL + 12, y);
      doc.text("Result", marginL + 65, y);
      doc.text("Interpretation", marginL + 105, y);
      y += 8;

      doc.setTextColor(0);
      doc.setFont("Helvetica", "normal");
      labResults.forEach((lr, i) => {
        checkPage(6);
        if (i % 2 === 0) {
          doc.setFillColor(245, 247, 250);
          doc.rect(marginL, y - 4, contentW, 6, "F");
        }
        doc.text(String(i + 1), marginL + 2, y);
        doc.text(lr.test_type || "-", marginL + 12, y);
        doc.text(lr.result || "-", marginL + 65, y);
        // truncate interpretation to fit
        const interp = (lr.interpretation || "-").substring(0, 30);
        doc.text(interp, marginL + 105, y);
        y += 6;
      });
      y += 3;
    }

    // ── certificates ──
    if (certificates.length > 0) {
      sectionHeader("CERTIFICATES");

      checkPage(12);
      doc.setFillColor(30, 64, 175);
      doc.rect(marginL, y - 4, contentW, 8, "F");
      doc.setTextColor(255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("#", marginL + 2, y);
      doc.text("Type", marginL + 12, y);
      doc.text("Date", marginL + 70, y);
      doc.text("Remarks", marginL + 110, y);
      y += 8;

      doc.setTextColor(0);
      doc.setFont("Helvetica", "normal");
      certificates.forEach((c, i) => {
        checkPage(6);
        if (i % 2 === 0) {
          doc.setFillColor(245, 247, 250);
          doc.rect(marginL, y - 4, contentW, 6, "F");
        }
        doc.text(String(i + 1), marginL + 2, y);
        doc.text(c.certificate_type || "-", marginL + 12, y);
        doc.text(fmtDate(c.issue_date || c.created_at), marginL + 70, y);
        doc.text((c.remarks || "-").substring(0, 25), marginL + 110, y);
        y += 6;
      });
      y += 3;
    }

    // ── fees & payment ──
    if (feesList.length > 0) {
      sectionHeader("FEES & PAYMENT");

      checkPage(12);
      doc.setFillColor(30, 64, 175);
      doc.rect(marginL, y - 4, contentW, 8, "F");
      doc.setTextColor(255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("#", marginL + 2, y);
      doc.text("Description", marginL + 12, y);
      doc.text("Amount", marginR - 2, y, { align: "right" });
      y += 8;

      doc.setTextColor(0);
      doc.setFont("Helvetica", "normal");
      feesList.forEach((f, i) => {
        checkPage(6);
        if (i % 2 === 0) {
          doc.setFillColor(245, 247, 250);
          doc.rect(marginL, y - 4, contentW, 6, "F");
        }
        doc.text(String(i + 1), marginL + 2, y);
        doc.text(f.feeType || f.fee_type || "-", marginL + 12, y);
        doc.text(fmtPdf(f.amount), marginR - 2, y, { align: "right" });
        y += 6;
      });

      // total
      y += 1;
      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.4);
      doc.line(marginL, y, marginR, y);
      y += 6;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.text("TOTAL", marginL + 12, y);
      doc.text(fmtPdf(totalAmount), marginR - 2, y, { align: "right" });
      y += 8;

      // payment details
      doc.setFontSize(9);
      labelValue("Status", rec.payment_status || "Unpaid");
      if (rec.payment_method && (rec.payment_status === "Paid" || rec.payment_status === "Partial")) {
        labelValue("Method", rec.payment_method);
      }
      if (rec.payment_reference && rec.payment_method !== "Cash") {
        labelValue("Reference", rec.payment_reference);
      }
    }

    // ── footer ──
    const lastPageH = doc.internal.pageSize.getHeight();
    y = lastPageH - 20;
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.4);
    doc.line(marginL, y, marginR, y);
    y += 6;
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("Powered by FinalHealth", pageW / 2, y, { align: "center" });

    doc.save(`medical-record-FH-${String(rec.record_id || 0).padStart(5, "0")}.pdf`);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={`/user/patients/${patientId}`}
              className="inline-block rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
            >
              ← Back to Patient
            </Link>

            {recordId && (
              <button
                type="button"
                onClick={generateFullPdf}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print PDF
              </button>
            )}
          </div>

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
                  patientInfo={patientsInfo}
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