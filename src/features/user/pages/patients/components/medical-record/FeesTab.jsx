import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
} from "docx";
import { useMedicalRecords } from "../../../../context/medical-records/useMedicalRecords.js";
import { useFeeMaster } from "../../../../context/fee-master/useFeeMaster.js";
import { apiRequest } from "../../../../../../api/httpClient/httpClient.js";
import { AddFeeModal, FEE_STANDARD_OPTIONS } from "../shared/AddItemModal.jsx";

const PAYMENT_STATUS_OPTIONS = ["Unpaid", "Partial", "Paid"];

const PAYMENT_METHOD_OPTIONS = [
  "Cash",
  "SSS",
  "Pag-IBIG",
  "PhilHealth",
  "HMO",
  "Credit Card",
  "Debit Card",
  "GCash",
  "Maya",
  "Bank Transfer",
  "Company Billing",
];

const STATUS_STYLES = {
  Unpaid: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-400",
  },
  Partial: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  Paid: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-400",
  },
};

export default function FeesTab({ medicalRecord, patientInfo }) {
  const navigate = useNavigate();

  const { updateMedicalRecord, getMedicalRecordByAppointmentId } =
    useMedicalRecords();

  const { fees, getAllFees, createFee } = useFeeMaster();

  const [isAddFeeOpen, setIsAddFeeOpen] = useState(false);

  const [feesList, setFeesList] = useState([]);
  const [selectedFeeType, setSelectedFeeType] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentReference, setPaymentReference] = useState("");

  const feeOptions = fees || [];

  useEffect(() => {
    getAllFees();
  }, []);

  useEffect(() => {
    if (!medicalRecord) return;

    setPaymentStatus(medicalRecord.payment_status || "Unpaid");
    setPaymentMethod(medicalRecord.payment_method || "");
    setPaymentReference(medicalRecord.payment_reference || "");

    // Load from record_fees JSONB (primary source of truth)
    const storedFees = medicalRecord.record_fees;
    if (storedFees) {
      const parsed = typeof storedFees === "string" ? JSON.parse(storedFees) : storedFees;
      if (Array.isArray(parsed) && parsed.length > 0) {
        setFeesList(parsed);
        return;
      }
    }

    // Fallback: migrate from old fixed columns into record_fees format
    const migrated = [];
    if (Number(medicalRecord.consultation_fee || 0) > 0) {
      migrated.push({ id: Date.now() + 1, feeType: "Consultation Fee", amount: Number(medicalRecord.consultation_fee) });
    }
    if (Number(medicalRecord.medicine_fee || 0) > 0) {
      migrated.push({ id: Date.now() + 2, feeType: "Medication Fee", amount: Number(medicalRecord.medicine_fee) });
    }
    if (Number(medicalRecord.lab_fee || 0) > 0) {
      migrated.push({ id: Date.now() + 3, feeType: "Lab Fee", amount: Number(medicalRecord.lab_fee) });
    }
    if (Number(medicalRecord.other_fee || 0) > 0) {
      migrated.push({ id: Date.now() + 4, feeType: "Other Fee", amount: Number(medicalRecord.other_fee) });
    }
    setFeesList(migrated);
  }, [medicalRecord]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(Number(value || 0));
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return new Date().toLocaleDateString();
    return new Date(dateValue).toLocaleDateString();
  };

  const saveToBackend = async (updatedFeesList, status, method, ref) => {
    if (!medicalRecord?.record_id) return;

    const totalFees = updatedFeesList.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);

    const payload = {
      record_date: medicalRecord.record_date,
      diagnosis: medicalRecord.diagnosis,
      treatment: medicalRecord.treatment,
      medications: medicalRecord.medications,
      assessment: medicalRecord.assessment,
      is_contagious: medicalRecord.is_contagious,
      contagious_description: medicalRecord.contagious_description,
      doctor_id: medicalRecord.doctor_id,
      clinic_id: medicalRecord.clinic_id,
      form_type: medicalRecord.form_type,
      pre_employment_data: medicalRecord.pre_employment_data ?? null,
      form_data: medicalRecord.form_data ?? null,
      consultation_fee: totalFees,
      medicine_fee: 0,
      lab_fee: 0,
      other_fee: 0,
      record_fees: updatedFeesList,
      payment_status: status,
      payment_method: (status === "Paid" || status === "Partial") ? method : null,
      payment_reference: (status === "Paid" || status === "Partial") && method && method !== "Cash" ? (ref || null) : null,
    };

    const res = await updateMedicalRecord(medicalRecord.record_id, payload);

    if (res?.ok !== false && medicalRecord?.appointment_id) {
      await getMedicalRecordByAppointmentId(medicalRecord.appointment_id);
    }
  };

  const handleFeeTypeChange = (feeName) => {
    setSelectedFeeType(feeName);
    const selectedFee = feeOptions.find((fee) => fee.fee_name === feeName);
    if (selectedFee) {
      setSelectedAmount(Number(selectedFee.amount || 0));
    }
  };

  const addFee = async () => {
    if (!selectedFeeType || selectedAmount === "") return;

    const updatedFeesList = [
      ...feesList,
      {
        id: Date.now(),
        feeType: selectedFeeType,
        amount: Number(selectedAmount),
      },
    ];

    setFeesList(updatedFeesList);
    setSelectedFeeType("");
    setSelectedAmount("");

    await saveToBackend(updatedFeesList, paymentStatus, paymentMethod, paymentReference);
  };

  const removeFee = async (id) => {
    const updatedFeesList = feesList.filter((fee) => fee.id !== id);
    setFeesList(updatedFeesList);
    await saveToBackend(updatedFeesList, paymentStatus, paymentMethod, paymentReference);
  };

  const handleStatusChange = async (newStatus) => {
    setPaymentStatus(newStatus);
    if (newStatus === "Unpaid") {
      setPaymentMethod("");
    }
    await saveToBackend(feesList, newStatus, newStatus === "Unpaid" ? "" : paymentMethod, paymentReference);
  };

  const handleMethodChange = async (newMethod) => {
    setPaymentMethod(newMethod);
    if (newMethod === "Cash") setPaymentReference("");
    await saveToBackend(feesList, paymentStatus, newMethod, paymentReference);
  };

  const handleReferenceChange = async (ref) => {
    setPaymentReference(ref);
  };

  const totalAmount = useMemo(() => {
    return feesList.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
  }, [feesList]);

  // ─── Receipt Helpers ────────────────────────────────────────
  const receiptNo = medicalRecord?.record_id
    ? `FH-${String(medicalRecord.record_id).padStart(5, "0")}`
    : "FH-00000";

  const receiptDate = medicalRecord?.record_date
    ? new Date(medicalRecord.record_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const patientName = patientInfo?.full_name || "-";
  const patientGender = patientInfo?.gender || "-";
  const patientAge = (() => {
    if (!patientInfo?.date_of_birth) return "-";
    const birth = new Date(patientInfo.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  })();
  const patientAddress = patientInfo?.address || "-";
  const patientContact = patientInfo?.contact_number || "-";

  const fmt = (v) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(Number(v || 0));

  // PDF-safe formatter — jsPDF Helvetica doesn't support ₱ symbol
  const fmtPdf = (v) => `PHP ${Number(v || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // ─── Fetch Clinic & Doctor Info ─────────────────────────────
  const fetchClinicAndDoctor = async () => {
    let clinic = null;
    let doctor = null;

    if (medicalRecord?.clinic_id) {
      const res = await apiRequest(`/api/clinic-routes/clinic/${medicalRecord.clinic_id}/clinic-info`);
      if (res?.ok && res.data) {
        const rows = Array.isArray(res.data) ? res.data : [res.data];
        clinic = rows[0] || null;
      }
    }

    if (medicalRecord?.doctor_id) {
      const res = await apiRequest(`/api/doctor-routes/doctor-informations/${medicalRecord.doctor_id}`);
      if (res?.ok && res.data) {
        const rows = Array.isArray(res.data) ? res.data : [res.data];
        doctor = rows[0] || null;
      }
    }

    return { clinic, doctor };
  };

  // ─── Generate PDF Receipt ───────────────────────────────────
  const generatePDF = async () => {
    if (feesList.length === 0) {
      alert("No fees to print.");
      return;
    }

    const { clinic, doctor } = await fetchClinicAndDoctor();

    const clinicName = clinic?.clinic_name || "FinalHealth Clinic";
    const clinicAddress = clinic?.address || "";
    const clinicContact = clinic?.contact_num || "";
    const clinicPermit = clinic?.business_permit_no || "";

    const doctorName = doctor
      ? `Dr. ${doctor.f_name || ""} ${doctor.m_name || ""} ${doctor.l_name || ""}`.replace(/\s+/g, " ").trim()
      : null;
    const doctorSpec = doctor?.specialization || null;
    const doctorLicense = doctor?.license_number || null;

    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header — Clinic Name
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text(clinicName, pageW / 2, y, { align: "center" });
    y += 7;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    if (clinicAddress) {
      doc.text(clinicAddress, pageW / 2, y, { align: "center" });
      y += 5;
    }
    if (clinicContact) {
      doc.text(`Tel: ${clinicContact}`, pageW / 2, y, { align: "center" });
      y += 5;
    }
    if (clinicPermit) {
      doc.text(`Business Permit No: ${clinicPermit}`, pageW / 2, y, { align: "center" });
      y += 5;
    }

    // Divider
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.8);
    doc.line(14, y, pageW - 14, y);
    y += 10;

    // Receipt Title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("OFFICIAL RECEIPT", pageW / 2, y, { align: "center" });
    y += 10;

    // Receipt meta
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Receipt No: ${receiptNo}`, 14, y);
    doc.text(`Date: ${receiptDate}`, pageW - 14, y, { align: "right" });
    y += 12;

    // Patient Info Section
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("PATIENT INFORMATION", 14, y);
    y += 2;
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(14, y, pageW - 14, y);
    y += 7;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    const patientRows = [
      ["Name", patientName],
      ["Age / Gender", `${patientAge} / ${patientGender}`],
      ["Address", patientAddress],
      ["Contact", patientContact],
    ];
    patientRows.forEach(([label, value]) => {
      doc.setFont("Helvetica", "bold");
      doc.text(`${label}:`, 14, y);
      doc.setFont("Helvetica", "normal");
      doc.text(String(value), 50, y);
      y += 6;
    });
    y += 4;

    // Doctor Info Section
    if (doctorName) {
      doc.setDrawColor(200);
      doc.setLineWidth(0.3);
      doc.line(14, y, pageW - 14, y);
      y += 7;

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.text("ATTENDING PHYSICIAN", 14, y);
      y += 7;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      const doctorRows = [
        ["Doctor", doctorName],
        ...(doctorSpec ? [["Specialization", doctorSpec]] : []),
        ...(doctorLicense ? [["License No", doctorLicense]] : []),
      ];
      doctorRows.forEach(([label, value]) => {
        doc.setFont("Helvetica", "bold");
        doc.text(`${label}:`, 14, y);
        doc.setFont("Helvetica", "normal");
        doc.text(String(value), 50, y);
        y += 6;
      });
      y += 4;
    }

    // Fees Table Header
    doc.setFillColor(30, 64, 175);
    doc.rect(14, y - 4, pageW - 28, 8, "F");
    doc.setTextColor(255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text("#", 20, y);
    doc.text("Description", 35, y);
    doc.text("Amount", pageW - 20, y, { align: "right" });
    y += 8;

    doc.setTextColor(0);
    doc.setFont("Helvetica", "normal");

    // Fee rows
    feesList.forEach((fee, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(245, 247, 250);
        doc.rect(14, y - 4, pageW - 28, 7, "F");
      }
      doc.text(String(i + 1), 20, y);
      doc.text(fee.feeType, 35, y);
      doc.text(fmtPdf(fee.amount), pageW - 20, y, { align: "right" });
      y += 7;
    });

    // Total row
    y += 1;
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.5);
    doc.line(14, y, pageW - 14, y);
    y += 7;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("TOTAL", 35, y);
    doc.text(fmtPdf(totalAmount), pageW - 20, y, { align: "right" });
    y += 14;

    // Payment Info
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(14, y, pageW - 14, y);
    y += 7;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("PAYMENT DETAILS", 14, y);
    y += 8;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text("Status:", 14, y);
    doc.setFont("Helvetica", "normal");
    doc.text(paymentStatus, 50, y);
    y += 6;

    if (paymentMethod && (paymentStatus === "Paid" || paymentStatus === "Partial")) {
      doc.setFont("Helvetica", "bold");
      doc.text("Method:", 14, y);
      doc.setFont("Helvetica", "normal");
      doc.text(paymentMethod, 50, y);
      y += 6;
    }

    if (
      paymentReference &&
      paymentMethod &&
      paymentMethod !== "Cash" &&
      (paymentStatus === "Paid" || paymentStatus === "Partial")
    ) {
      doc.setFont("Helvetica", "bold");
      doc.text("Reference No:", 14, y);
      doc.setFont("Helvetica", "normal");
      doc.text(paymentReference, 50, y);
      y += 6;
    }

    // Footer
    y = doc.internal.pageSize.getHeight() - 25;
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.5);
    doc.line(14, y, pageW - 14, y);
    y += 8;
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Thank you! Please come again.", pageW / 2, y, {
      align: "center",
    });
    y += 5;
    doc.text("Powered by FinalHealth", pageW / 2, y, { align: "center" });

    doc.save(`receipt-${receiptNo}.pdf`);
  };

  // ─── Generate Word Receipt ──────────────────────────────────
  const generateWord = async () => {
    if (feesList.length === 0) {
      alert("No fees to print.");
      return;
    }

    const { clinic, doctor } = await fetchClinicAndDoctor();

    const clinicName = clinic?.clinic_name || "FinalHealth Clinic";
    const clinicAddress = clinic?.address || "";
    const clinicContact = clinic?.contact_num || "";
    const clinicPermit = clinic?.business_permit_no || "";

    const doctorName = doctor
      ? `Dr. ${doctor.f_name || ""} ${doctor.m_name || ""} ${doctor.l_name || ""}`.replace(/\s+/g, " ").trim()
      : null;
    const doctorSpec = doctor?.specialization || null;
    const doctorLicense = doctor?.license_number || null;

    const noBorder = {
      top: { style: BorderStyle.NONE, size: 0 },
      bottom: { style: BorderStyle.NONE, size: 0 },
      left: { style: BorderStyle.NONE, size: 0 },
      right: { style: BorderStyle.NONE, size: 0 },
    };

    const thinBorder = {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    };

    // Build fee table rows
    const feeRows = feesList.map(
      (fee, i) =>
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: String(i + 1), size: 20 })],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              width: { size: 800, type: WidthType.DXA },
              borders: thinBorder,
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: fee.feeType, size: 20 })],
                }),
              ],
              width: { size: 5500, type: WidthType.DXA },
              borders: thinBorder,
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: fmt(fee.amount), size: 20 }),
                  ],
                  alignment: AlignmentType.RIGHT,
                }),
              ],
              width: { size: 2500, type: WidthType.DXA },
              borders: thinBorder,
            }),
          ],
        })
    );

    // Total row
    const totalRow = new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: "" })],
          width: { size: 800, type: WidthType.DXA },
          borders: noBorder,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "TOTAL",
                  bold: true,
                  size: 22,
                }),
              ],
            }),
          ],
          width: { size: 5500, type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: "1E40AF" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
          },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: fmt(totalAmount),
                  bold: true,
                  size: 22,
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
          ],
          width: { size: 2500, type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: "1E40AF" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
          },
        }),
      ],
    });

    // Header table row
    const headerRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "#", bold: true, size: 20, color: "FFFFFF" })],
              alignment: AlignmentType.CENTER,
            }),
          ],
          width: { size: 800, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: "1E40AF" },
          borders: thinBorder,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Description", bold: true, size: 20, color: "FFFFFF" })],
            }),
          ],
          width: { size: 5500, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: "1E40AF" },
          borders: thinBorder,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Amount", bold: true, size: 20, color: "FFFFFF" })],
              alignment: AlignmentType.RIGHT,
            }),
          ],
          width: { size: 2500, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: "1E40AF" },
          borders: thinBorder,
        }),
      ],
    });

    // Payment details
    const paymentLines = [
      new Paragraph({
        children: [
          new TextRun({ text: "Status: ", bold: true, size: 20 }),
          new TextRun({ text: paymentStatus, size: 20 }),
        ],
      }),
    ];
    if (paymentMethod && (paymentStatus === "Paid" || paymentStatus === "Partial")) {
      paymentLines.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Method: ", bold: true, size: 20 }),
            new TextRun({ text: paymentMethod, size: 20 }),
          ],
        })
      );
    }
    if (
      paymentReference &&
      paymentMethod &&
      paymentMethod !== "Cash" &&
      (paymentStatus === "Paid" || paymentStatus === "Partial")
    ) {
      paymentLines.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Reference No: ", bold: true, size: 20 }),
            new TextRun({ text: paymentReference, size: 20 }),
          ],
        })
      );
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Clinic Header
            new Paragraph({
              children: [
                new TextRun({
                  text: clinicName,
                  bold: true,
                  size: 36,
                  color: "1E40AF",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            clinicAddress
              ? new Paragraph({
                  children: [new TextRun({ text: clinicAddress, size: 18, color: "666666" })],
                  alignment: AlignmentType.CENTER,
                })
              : new Paragraph({ text: "" }),
            clinicContact
              ? new Paragraph({
                  children: [new TextRun({ text: `Tel: ${clinicContact}`, size: 18, color: "666666" })],
                  alignment: AlignmentType.CENTER,
                })
              : new Paragraph({ text: "" }),
            clinicPermit
              ? new Paragraph({
                  children: [new TextRun({ text: `Business Permit No: ${clinicPermit}`, size: 16, color: "999999" })],
                  alignment: AlignmentType.CENTER,
                })
              : new Paragraph({ text: "" }),
            new Paragraph({ text: "" }),

            // Divider (using bottom border on an empty paragraph)
            new Paragraph({
              border: {
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 6,
                  color: "1E40AF",
                },
              },
              text: "",
            }),
            new Paragraph({ text: "" }),

            // Receipt Title
            new Paragraph({
              children: [
                new TextRun({
                  text: "OFFICIAL RECEIPT",
                  bold: true,
                  size: 28,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),

            // Receipt Meta
            new Paragraph({
              children: [
                new TextRun({
                  text: `Receipt No: ${receiptNo}        Date: ${receiptDate}`,
                  size: 20,
                }),
              ],
            }),
            new Paragraph({ text: "" }),

            // Patient Info Header
            new Paragraph({
              children: [
                new TextRun({
                  text: "PATIENT INFORMATION",
                  bold: true,
                  size: 22,
                  color: "1E40AF",
                }),
              ],
            }),
            new Paragraph({
              border: {
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 1,
                  color: "CCCCCC",
                },
              },
              text: "",
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Name: ", bold: true, size: 20 }),
                new TextRun({ text: patientName, size: 20 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Age / Gender: ", bold: true, size: 20 }),
                new TextRun({ text: `${patientAge} / ${patientGender}`, size: 20 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Address: ", bold: true, size: 20 }),
                new TextRun({ text: patientAddress, size: 20 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Contact: ", bold: true, size: 20 }),
                new TextRun({ text: patientContact, size: 20 }),
              ],
            }),
            new Paragraph({ text: "" }),

            // Doctor Info Section
            ...(doctorName
              ? [
                  new Paragraph({
                    border: {
                      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                    },
                    text: "",
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "ATTENDING PHYSICIAN", bold: true, size: 22, color: "1E40AF" }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Doctor: ", bold: true, size: 20 }),
                      new TextRun({ text: doctorName, size: 20 }),
                    ],
                  }),
                  ...(doctorSpec
                    ? [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Specialization: ", bold: true, size: 20 }),
                            new TextRun({ text: doctorSpec, size: 20 }),
                          ],
                        }),
                      ]
                    : []),
                  ...(doctorLicense
                    ? [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "License No: ", bold: true, size: 20 }),
                            new TextRun({ text: doctorLicense, size: 20 }),
                          ],
                        }),
                      ]
                    : []),
                  new Paragraph({ text: "" }),
                ]
              : []),

            // Fees Table
            new Table({
              width: { size: 8800, type: WidthType.DXA },
              rows: [headerRow, ...feeRows, totalRow],
            }),
            new Paragraph({ text: "" }),

            // Payment Details
            new Paragraph({
              border: {
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 1,
                  color: "CCCCCC",
                },
              },
              text: "",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "PAYMENT DETAILS",
                  bold: true,
                  size: 22,
                  color: "1E40AF",
                }),
              ],
            }),
            ...paymentLines,
            new Paragraph({ text: "" }),
            new Paragraph({ text: "" }),

            // Footer
            new Paragraph({
              border: {
                top: {
                  style: BorderStyle.SINGLE,
                  size: 4,
                  color: "1E40AF",
                },
              },
              text: "",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Thank you! Please come again.",
                  italics: true,
                  size: 18,
                  color: "888888",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Powered by FinalHealth",
                  italics: true,
                  size: 16,
                  color: "AAAAAA",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${receiptNo}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const statusStyle = STATUS_STYLES[paymentStatus] || STATUS_STYLES.Unpaid;

  return (
    <div className="space-y-5">
      <h2 className="text-center text-lg font-semibold text-gray-800">Fees</h2>

      {/* Payment Status & Method */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {PAYMENT_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {(paymentStatus === "Paid" || paymentStatus === "Partial") && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => handleMethodChange(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select Method</option>
              {PAYMENT_METHOD_OPTIONS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Payment Reference Number — only for non-cash methods */}
      {paymentMethod && paymentMethod !== "Cash" && (paymentStatus === "Paid" || paymentStatus === "Partial") && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {paymentMethod === "SSS"
              ? "SSS Claim Reference No."
              : paymentMethod === "Pag-IBIG"
                ? "Pag-IBIG Claim Reference No."
                : paymentMethod === "PhilHealth"
                  ? "PhilHealth eClaim No."
                  : paymentMethod === "HMO"
                    ? "HMO Authorization Code"
                    : paymentMethod === "Company Billing"
                      ? "Billing/SO Reference No."
                      : "Transaction Reference No."}
          </label>
          <input
            type="text"
            value={paymentReference}
            onChange={(e) => handleReferenceChange(e.target.value)}
            onBlur={async () => {
              await saveToBackend(feesList, paymentStatus, paymentMethod, paymentReference);
            }}
            placeholder="Enter reference number"
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Fee Type Selector */}
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <div className="flex w-full gap-2 sm:w-[280px]">
          <select
            value={selectedFeeType}
            onChange={(e) => handleFeeTypeChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select Fee Type</option>
            {feeOptions.map((fee) => (
              <option key={fee.fee_id} value={fee.fee_name}>
                {fee.fee_name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsAddFeeOpen(true)}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
            title="Manage fee options"
          >
            +
          </button>
        </div>

        <input
          type="number"
          value={selectedAmount}
          placeholder="Amount"
          readOnly
          className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm sm:w-[200px]"
        />

        <button
          onClick={addFee}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Fees Table */}
      {feesList.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          No fees added.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Fee Type
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Amount
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {feesList.map((fee, index) => (
                <tr
                  key={fee.id}
                  className={`text-center ${
                    index !== feesList.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {fee.feeType}
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                    {formatCurrency(fee.amount)}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-800">
                    {formatDate(medicalRecord?.created_at)}
                  </td>

                  <td className="px-4 py-4">
                    <button
                      onClick={() => removeFee(fee.id)}
                      className="text-sm font-semibold text-red-500 transition hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Total Card with Status Badge */}
      <div className={`mx-auto max-w-md rounded-xl border ${statusStyle.border} p-4 text-center ${statusStyle.bg}`}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${statusStyle.text}`}>
            {paymentStatus}
          </span>
          {paymentMethod && (paymentStatus === "Paid" || paymentStatus === "Partial") && (
            <span className="text-xs text-gray-500">
              via {paymentMethod}
              {paymentReference && paymentMethod !== "Cash" && ` • Ref: ${paymentReference}`}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">Total Amount</p>
        <p className={`mt-1 text-xl font-bold ${statusStyle.text}`}>
          {formatCurrency(totalAmount)}
        </p>
      </div>

      {/* Download Receipt Buttons */}
      {feesList.length > 0 && (
        <div className="mx-auto flex max-w-md items-center justify-center gap-3">
          <button
            type="button"
            onClick={generatePDF}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
          <button
            type="button"
            onClick={generateWord}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Word
          </button>
        </div>
      )}

      <AddFeeModal
        isOpen={isAddFeeOpen}
        onClose={() => setIsAddFeeOpen(false)}
        onSubmit={async (data) => {
          const res = await createFee(data);
          if (res?.ok !== false) {
            await getAllFees();
            return true;
          }
          return false;
        }}
        categorizedOptions={FEE_STANDARD_OPTIONS}
      />
    </div>
  );
}
