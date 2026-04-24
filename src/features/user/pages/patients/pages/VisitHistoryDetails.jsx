import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Layout";

export default function VisitHistoryDetails() {
  const navigate = useNavigate();
  const { patientId, visitId } = useParams();

  const [activeTab, setActiveTab] = useState("medical-record");

  const visitDetails = useMemo(() => {
    const hardcodedVisits = {
      1: {
        id: 1,
        visitDate: "March 15, 2026",
        visitType: "Consultation",
        patientName: "Maria Santos Reyes",
        doctorName: "Dr. Maria Santos",
        clinicName: "FinalHealth Main Clinic",
        overallStatus: "Completed",

        medicalRecord: {
          recordDate: "March 15, 2026",
          chiefComplaint: "Fever, cough, and sore throat for 3 days",
          assessment: "Stable and responsive. Mild dehydration observed.",
          notes:
            "Patient advised to rest and return after 5 days if symptoms persist.",
          upload: null,
          status: "Completed",
        },

        diagnosis: {
          title: "Upper Respiratory Tract Infection",
          description:
            "Patient presents symptoms consistent with a non-severe upper respiratory tract infection.",
          upload: null,
          status: "Completed",
        },

        treatment: {
          title: "Supportive Treatment",
          description:
            "Hydration, rest, temperature monitoring, and antipyretic medication were advised.",
          upload: null,
          status: "Completed",
        },

        prescription: {
          prescribedDate: "March 15, 2026",
          instructions:
            "Take medicine after meals. Increase fluid intake. Return if symptoms worsen.",
          upload: null,
          status: "Completed",
        },

        medications: [
          {
            id: 1,
            medicationName: "Paracetamol",
            dosage: "500 mg",
            frequency: "Every 6 hours",
            duration: "3 days",
            instructions: "Take after meals",
            upload: null,
            status: "Completed",
          },
          {
            id: 2,
            medicationName: "Cetirizine",
            dosage: "10 mg",
            frequency: "Once daily",
            duration: "5 days",
            instructions: "Take before sleep",
            upload: null,
            status: "Completed",
          },
        ],

        labResults: [
          {
            id: 1,
            testType: "CBC",
            testDate: "March 15, 2026",
            result: "Within normal range",
            interpretation: "No bacterial markers noted",
            upload: null,
            status: "Pending Upload",
          },
        ],

        fees: {
          consultationFee: 500,
          medicineFee: 250,
          labFee: 100,
          otherFee: 0,
          totalAmount: 850,
        },
      },

      2: {
        id: 2,
        visitDate: "February 27, 2026",
        visitType: "Follow-up",
        patientName: "Maria Santos Reyes",
        doctorName: "Dr. John Reyes",
        clinicName: "FinalHealth Main Clinic",
        overallStatus: "Completed",

        medicalRecord: {
          recordDate: "February 27, 2026",
          chiefComplaint: "Follow-up blood pressure monitoring",
          assessment: "Condition improved compared to last visit.",
          notes: "Continue monitoring BP twice daily.",
          upload: null,
          status: "Completed",
        },

        diagnosis: {
          title: "Borderline Elevated Blood Pressure",
          description:
            "Patient remains under observation with mild improvement.",
          upload: null,
          status: "Completed",
        },

        treatment: {
          title: "Lifestyle Modification",
          description:
            "Reduced sodium intake, regular walking, and sleep improvement were advised.",
          upload: null,
          status: "Completed",
        },

        prescription: {
          prescribedDate: "February 27, 2026",
          instructions: "Maintain low-sodium diet and daily BP log.",
          upload: null,
          status: "Pending Upload",
        },

        medications: [
          {
            id: 1,
            medicationName: "Amlodipine",
            dosage: "5 mg",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take every morning",
            upload: null,
            status: "Completed",
          },
        ],

        labResults: [],

        fees: {
          consultationFee: 400,
          medicineFee: 200,
          labFee: 0,
          otherFee: 0,
          totalAmount: 600,
        },
      },

      3: {
        id: 3,
        visitDate: "January 20, 2026",
        visitType: "Pre-Employment",
        patientName: "Maria Santos Reyes",
        doctorName: "Dr. Angela Cruz",
        clinicName: "FinalHealth Diagnostic Center",
        overallStatus: "Completed",

        medicalRecord: {
          recordDate: "January 20, 2026",
          chiefComplaint: "Routine pre-employment evaluation",
          assessment: "Fit to work pending lab completion.",
          notes: "Awaiting final lab attachments.",
          upload: null,
          status: "Completed",
        },

        diagnosis: {
          title: "Fit to Work - Pending Lab Review",
          description: "Initial physical examination passed.",
          upload: null,
          status: "Completed",
        },

        treatment: {
          title: "No treatment required",
          description: "Routine evaluation only.",
          upload: null,
          status: "Completed",
        },

        prescription: {
          prescribedDate: "January 20, 2026",
          instructions: "No prescription given.",
          upload: null,
          status: "Not Needed",
        },

        medications: [],

        labResults: [
          {
            id: 1,
            testType: "Chest X-Ray",
            testDate: "January 20, 2026",
            result: "Pending",
            interpretation: "Awaiting upload",
            upload: null,
            status: "Pending Upload",
          },
          {
            id: 2,
            testType: "Urinalysis",
            testDate: "January 20, 2026",
            result: "Pending",
            interpretation: "Awaiting upload",
            upload: null,
            status: "Pending Upload",
          },
        ],

        fees: {
          consultationFee: 500,
          medicineFee: 0,
          labFee: 700,
          otherFee: 0,
          totalAmount: 1200,
        },
      },

      4: {
        id: 4,
        visitDate: "December 10, 2025",
        visitType: "Consultation",
        patientName: "Maria Santos Reyes",
        doctorName: "Dr. Miguel Torres",
        clinicName: "FinalHealth Family Clinic",
        overallStatus: "Completed",

        medicalRecord: {
          recordDate: "December 10, 2025",
          chiefComplaint: "Stomach pain and bloating",
          assessment: "Likely mild gastritis due to irregular meals.",
          notes: "Avoid acidic foods.",
          upload: null,
          status: "Completed",
        },

        diagnosis: {
          title: "Mild Gastritis",
          description:
            "Symptoms suggest mild gastritis without signs of acute abdomen.",
          upload: null,
          status: "Completed",
        },

        treatment: {
          title: "Diet Modification and Antacid",
          description:
            "Smaller meals, avoid coffee and spicy foods, start antacid.",
          upload: null,
          status: "Completed",
        },

        prescription: {
          prescribedDate: "December 10, 2025",
          instructions: "Take medicine 30 minutes before meals.",
          upload: null,
          status: "Completed",
        },

        medications: [
          {
            id: 1,
            medicationName: "Omeprazole",
            dosage: "20 mg",
            frequency: "Once daily",
            duration: "14 days",
            instructions: "Before breakfast",
            upload: null,
            status: "Completed",
          },
          {
            id: 2,
            medicationName: "Antacid Syrup",
            dosage: "10 mL",
            frequency: "3 times daily",
            duration: "7 days",
            instructions: "After meals",
            upload: null,
            status: "Pending Upload",
          },
        ],

        labResults: [],

        fees: {
          consultationFee: 500,
          medicineFee: 350,
          labFee: 0,
          otherFee: 100,
          totalAmount: 950,
        },
      },
    };

    return hardcodedVisits[visitId] || hardcodedVisits[1];
  }, [visitId]);

  const tabs = [
    { key: "medical-record", label: "Medical Record" },
    { key: "diagnosis", label: "Diagnosis" },
    { key: "treatment", label: "Treatment" },
    { key: "prescription", label: "Prescription" },
    { key: "medications", label: "Medications" },
    { key: "lab-results", label: "Lab Results" },
    { key: "fees", label: "Fees" },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending Upload":
        return "bg-amber-100 text-amber-700";
      case "Not Needed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
        status
      )}`}
    >
      {status}
    </span>
  );

  const NoUpload = () => (
    <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500">
      No upload yet
    </div>
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(Number(value || 0));

  const renderTabContent = () => {
    switch (activeTab) {
      case "medical-record":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Medical Record
              </h3>
              <StatusBadge status={visitDetails.medicalRecord.status} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Record Date
                </p>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {visitDetails.medicalRecord.recordDate}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Chief Complaint
                </p>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {visitDetails.medicalRecord.chiefComplaint}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Assessment
              </p>
              <p className="mt-2 text-sm text-gray-800">
                {visitDetails.medicalRecord.assessment}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Notes
              </p>
              <p className="mt-2 text-sm text-gray-800">
                {visitDetails.medicalRecord.notes}
              </p>
              {!visitDetails.medicalRecord.upload && <NoUpload />}
            </div>
          </div>
        );

      case "diagnosis":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-800">Diagnosis</h3>
              <StatusBadge status={visitDetails.diagnosis.status} />
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Diagnosis Title
              </p>
              <p className="mt-2 text-sm font-medium text-gray-800">
                {visitDetails.diagnosis.title}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Description
              </p>
              <p className="mt-2 text-sm text-gray-800">
                {visitDetails.diagnosis.description}
              </p>
              {!visitDetails.diagnosis.upload && <NoUpload />}
            </div>
          </div>
        );

      case "treatment":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-800">Treatment</h3>
              <StatusBadge status={visitDetails.treatment.status} />
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Treatment Title
              </p>
              <p className="mt-2 text-sm font-medium text-gray-800">
                {visitDetails.treatment.title}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Description
              </p>
              <p className="mt-2 text-sm text-gray-800">
                {visitDetails.treatment.description}
              </p>
              {!visitDetails.treatment.upload && <NoUpload />}
            </div>
          </div>
        );

      case "prescription":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Prescription
              </h3>
              <StatusBadge status={visitDetails.prescription.status} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Prescribed Date
                </p>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {visitDetails.prescription.prescribedDate}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Instructions
                </p>
                <p className="mt-2 text-sm text-gray-800">
                  {visitDetails.prescription.instructions}
                </p>
              </div>
            </div>

            {!visitDetails.prescription.upload && <NoUpload />}
          </div>
        );

      case "medications":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Medications
              </h3>
            </div>

            {visitDetails.medications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                No medications recorded
              </div>
            ) : (
              <div className="space-y-4">
                {visitDetails.medications.map((med) => (
                  <div
                    key={med.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h4 className="text-base font-semibold text-gray-800">
                        {med.medicationName}
                      </h4>
                      <StatusBadge status={med.status} />
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Dosage
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          {med.dosage}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Frequency
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          {med.frequency}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Duration
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          {med.duration}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Instructions
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          {med.instructions}
                        </p>
                      </div>
                    </div>

                    {!med.upload && <NoUpload />}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "lab-results":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Lab Results
              </h3>
            </div>

            {visitDetails.labResults.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                No lab results recorded
              </div>
            ) : (
              <div className="space-y-4">
                {visitDetails.labResults.map((lab) => (
                  <div
                    key={lab.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h4 className="text-base font-semibold text-gray-800">
                        {lab.testType}
                      </h4>
                      <StatusBadge status={lab.status} />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Test Date
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          {lab.testDate}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Result
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          {lab.result}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Interpretation
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          {lab.interpretation}
                        </p>
                      </div>
                    </div>

                    {!lab.upload && <NoUpload />}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "fees":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Fees</h3>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Consultation Fee
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {formatCurrency(visitDetails.fees.consultationFee)}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Medicine Fee
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {formatCurrency(visitDetails.fees.medicineFee)}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Lab Fee
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {formatCurrency(visitDetails.fees.labFee)}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Other Fee
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {formatCurrency(visitDetails.fees.otherFee)}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Total Amount
                </p>
                <p className="mt-2 text-base font-bold text-blue-700">
                  {formatCurrency(visitDetails.fees.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate(`/user/patients/${patientId}`)}
                  className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  ← Back to Patient Info
                </button>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Visit Details
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Full medical details for this visit history entry
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={visitDetails.overallStatus} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Patient
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {visitDetails.patientName}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Visit Date
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {visitDetails.visitDate}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Visit Type
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {visitDetails.visitType}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Doctor
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {visitDetails.doctorName}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Clinic
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {visitDetails.clinicName}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-6 overflow-x-auto">
              <div className="flex min-w-max gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      activeTab === tab.key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {renderTabContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
}