import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "../../../components/Layout";
import { useMedicalRecords } from "../../../context/medical-records/useMedicalRecords";
import { resolveImageUrl } from "../../../../../utils/resolveImageUrl";

export default function MedicalHistoryInfo() {
  function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "₱0.00";
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(value));
}
  const { recordId } = useParams();
  const navigate = useNavigate();

  const { getMedicalRecordsFullDetails, medicalRecordsFullDetails } =
    useMedicalRecords();

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadMedicalRecord = useCallback(async () => {
    if (!recordId) {
      setPageError("Invalid medical record ID.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setPageError("");
      await getMedicalRecordsFullDetails(recordId);
    } catch (error) {
      setPageError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load medical record.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [recordId, getMedicalRecordsFullDetails]);

  useEffect(() => {
    loadMedicalRecord();
  }, []);

  const recordDetails = medicalRecordsFullDetails ?? {};

  const {
    medicalRecord,
    vitalSigns = [],
    prescriptions = [],
    labResults = [],
    referrals = [],
    followups = [],
    certificates = [],
    documents = [],
  } = recordDetails;

  const isPreEmployment = medicalRecord?.form_type === "pre_employment";

  const preEmployment = useMemo(
    () => medicalRecord?.pre_employment_data || {},
    [medicalRecord],
  );

  if (isLoading) {
    return (
      <Layout>
        <PageStatus
          title="Loading medical record"
          message="Please wait while the record details are being fetched."
          variant="loading"
        />
      </Layout>
    );
  }

  if (pageError) {
    return (
      <Layout>
        <PageStatus
          title="Unable to load medical record"
          message={pageError}
          variant="error"
          action={
            <button
              onClick={loadMedicalRecord}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Retry
            </button>
          }
        />
      </Layout>
    );
  }

  if (!medicalRecord) {
    return (
      <Layout>
        <PageStatus
          title="Medical record not found"
          message="The requested record does not exist or is no longer available."
          variant="empty"
          action={
            <button
              onClick={() => navigate(-1)}
              className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              Go Back
            </button>
          }
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-blue-50">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <Header
            recordId={medicalRecord.record_id}
            onBack={() => navigate(-1)}
          />

          <SummaryCard medicalRecord={medicalRecord} />

          <div className="flex flex-col gap-6 xl:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <Section title="Visit Information">
                <InfoWrap>
                  <Info
                    label="Date"
                    value={formatDate(medicalRecord.record_date)}
                  />
                  <Info
                    label="Doctor"
                    value={medicalRecord.doctor_name}
                  />
                  <Info
                    label="Clinic"
                    value={medicalRecord.clinic_name}
                  />
                  <Info
                    label="Record Type"
                    value={formatLabel(medicalRecord.form_type)}
                  />
                  <Info
                    label="Assessment"
                    value={medicalRecord.assessment}
                    wide
                  />
                </InfoWrap>
              </Section>

<Section title={isPreEmployment ? "Medical Details" : "Diagnosis"}>
  <InfoWrap>
    <Info
      label="Diagnosis"
      value={medicalRecord.diagnosis}
      wide
    />
    <Info
      label="Treatment"
      value={medicalRecord.treatment}
      wide
    />
    <Info
      label="Medications"
      value={medicalRecord.medications}
      wide
    />
    <Info
      label="Assessment"
      value={medicalRecord.assessment}
      wide
    />
  </InfoWrap>
</Section>

<Section title="Fees">
  <InfoWrap>
    <Info
      label="Consultation Fee"
      value={formatCurrency(medicalRecord.consultation_fee)}
    />
    <Info
      label="Medicine Fee"
      value={formatCurrency(medicalRecord.medicine_fee)}
    />
    <Info
      label="Lab Fee"
      value={formatCurrency(medicalRecord.lab_fee)}
    />
    <Info
      label="Other Fee"
      value={formatCurrency(medicalRecord.other_fee)}
    />
    <Info
      label="Total Amount"
      value={formatCurrency(medicalRecord.total_amount)}
    />
  </InfoWrap>
</Section>

{isPreEmployment && (
  <>
    <Section title="Pre-Employment Details">
      <InfoWrap>
        <Info
          label="Requesting For"
          value={preEmployment.requestingFor}
        />
        <Info
          label="Findings"
          value={preEmployment.findings}
        />
        <Info
          label="Recommendation"
          value={preEmployment.recommendation}
        />
        <Info
          label="Medical Examiner"
          value={preEmployment.medicalExaminer}
        />
        <Info
          label="License Number"
          value={preEmployment.licenseNumber}
        />
      </InfoWrap>
    </Section>

    <Section title="Past Medical History">
      <InfoWrap>
        <Info
          label="Items"
          value={formatArray(preEmployment.pastMedicalHistory)}
          wide
        />
      </InfoWrap>
    </Section>

    <Section title="Family History">
      <InfoWrap>
        <Info
          label="Items"
          value={formatArray(preEmployment.familyHistory)}
          wide
        />
      </InfoWrap>
    </Section>

    <Section title="Social History">
      <InfoWrap>
        <Info
          label="Items"
          value={formatArray(preEmployment.socialHistory)}
          wide
        />
      </InfoWrap>
    </Section>

    <Section title="Physical Exam">
      <InfoWrap>
        <Info
          label="Blood Pressure"
          value={preEmployment?.physicalExam?.bp}
        />
        <Info
          label="Heart Rate"
          value={preEmployment?.physicalExam?.hr}
        />
        <Info
          label="Temperature"
          value={preEmployment?.physicalExam?.temp}
        />
        <Info
          label="Respiratory Rate"
          value={preEmployment?.physicalExam?.rr}
        />
        <Info
          label="Height"
          value={preEmployment?.physicalExam?.height}
        />
        <Info
          label="Weight"
          value={preEmployment?.physicalExam?.weight}
        />
        <Info
          label="BMI"
          value={preEmployment?.physicalExam?.bmi}
        />
      </InfoWrap>
    </Section>
  </>
)}
              {vitalSigns.length > 0 && (
                <Section title="Vital Signs">
                  <RecordList
                    records={vitalSigns}
                    getKey={(item) => item.vital_id}
                    renderItem={(item) => (
                      <DetailCard
                        title={`Vital Sign #${item.vital_id}`}
                        imagePath={item.vital_img_path}
                        items={[
                          {
                            label: "Blood Pressure",
                            value: item.blood_pressure,
                          },
                          {
                            label: "Heart Rate",
                            value: item.heart_rate,
                          },
                          {
                            label: "Temperature",
                            value: formatUnit(item.temperature, "°C"),
                          },
                          {
                            label: "Oxygen Saturation",
                            value: formatUnit(
                              item.oxygen_saturation,
                              "%",
                              false,
                            ),
                          },
                          {
                            label: "Weight",
                            value: formatUnit(item.weight, "kg"),
                          },
                        ]}
                      />
                    )}
                  />
                </Section>
              )}

              {prescriptions.length > 0 && (
                <Section title="Prescriptions">
                  <RecordList
                    records={prescriptions}
                    getKey={(item) => item.prescription_id}
                    renderItem={(item) => (
                      <DetailCard
                        title={`Prescription #${item.prescription_id}`}
                        imagePath={item.prescription_img_path}
                        items={[
                          {
                            label: "Medication",
                            value: item.medication_name,
                          },
                          {
                            label: "Dosage",
                            value: item.dosage,
                          },
                          {
                            label: "Frequency",
                            value: item.frequency,
                          },
                          {
                            label: "Duration",
                            value: item.duration,
                          },
                        ]}
                      />
                    )}
                  />
                </Section>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-6">
              {labResults.length > 0 && (
                <Section title="Lab Results">
                  <RecordList
                    records={labResults}
                    getKey={(item) => item.result_id}
                    renderItem={(item) => (
                      <DetailCard
                        title={`Lab Result #${item.result_id}`}
                        imagePath={item.lab_img_path}
                        items={[
                          {
                            label: "Test",
                            value: item.test_type,
                          },
                          {
                            label: "Result",
                            value: item.result,
                            wide: true,
                          },
                          {
                            label: "Interpretation",
                            value: item.interpretation,
                            wide: true,
                          },
                        ]}
                      />
                    )}
                  />
                </Section>
              )}

              {referrals.length > 0 && (
                <Section title="Referrals">
                  <RecordList
                    records={referrals}
                    getKey={(item) => item.referral_id}
                    renderItem={(item) => (
                      <DetailCard
                        title={`Referral #${item.referral_id}`}
                        imagePath={item.referral_img_path}
                        items={[
                          {
                            label: "Referred To",
                            value: item.referred_to,
                          },
                          {
                            label: "Reason",
                            value: item.reason,
                            wide: true,
                          },
                        ]}
                      />
                    )}
                  />
                </Section>
              )}

              {followups.length > 0 && (
                <Section title="Follow-up Notes">
                  <RecordList
                    records={followups}
                    getKey={(item) => item.followup_id}
                    renderItem={(item) => (
                      <DetailCard
                        title={`Follow-up #${item.followup_id}`}
                        imagePath={item.followup_img_path}
                        items={[
                          {
                            label: "Follow-up Date",
                            value: formatDate(item.followup_date),
                          },
                          {
                            label: "Notes",
                            value: item.notes,
                            wide: true,
                          },
                        ]}
                      />
                    )}
                  />
                </Section>
              )}

              {certificates.length > 0 && (
                <Section title="Certificates">
                  <RecordList
                    records={certificates}
                    getKey={(item) => item.certificates_id}
                    renderItem={(item) => (
                      <DetailCard
                        title={`Certificate #${item.certificates_id}`}
                        imagePath={item.certificates_img_path}
                        items={[
                          {
                            label: "Type",
                            value: item.certificate_type,
                          },
                          {
                            label: "Remarks",
                            value: item.remarks,
                            wide: true,
                          },
                        ]}
                      />
                    )}
                  />
                </Section>
              )}

              {documents.length > 0 && (
                <Section title="Medical Record Documents">
                  <div className="flex flex-wrap gap-4">
                    {documents.map((document) => (
                      <div
                        key={document.document_id}
                        className="w-full sm:w-[calc(50%-0.5rem)] xl:w-[calc(50%-0.5rem)]"
                      >
                        <DocumentPreview src={document.document_img_path} />
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Header({ recordId, onBack }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        onClick={onBack}
        className="inline-flex w-fit items-center justify-center rounded-xl border-2 border-blue-600 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
      >
        ← Back
      </button>

      <div className="rounded-2xl border border-blue-200 bg-white px-4 py-3 shadow-sm">
        <h1 className="text-lg font-bold text-blue-700 sm:text-2xl">
          Medical Record #{recordId}
        </h1>
      </div>
    </div>
  );
}

function SummaryCard({ medicalRecord }) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap gap-4">
        <SummaryInfo
          label="Date"
          value={formatDate(medicalRecord?.record_date)}
        />
        <SummaryInfo
          label="Doctor"
          value={medicalRecord?.doctor_name}
        />
        <SummaryInfo
          label="Clinic"
          value={medicalRecord?.clinic_name}
        />
        <SummaryInfo
          label="Form Type"
          value={formatLabel(medicalRecord?.form_type)}
        />
      </div>
    </div>
  );
}

function SummaryInfo({ label, value }) {
  return (
    <div className="min-w-[180px] flex-1 rounded-xl bg-blue-50 px-4 py-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-800 break-words">
        {value || "-"}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 border-b border-blue-100 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-blue-700 sm:text-base">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function InfoWrap({ children }) {
  return <div className="flex flex-wrap gap-4">{children}</div>;
}

function Info({ label, value, wide = false }) {
  return (
    <div
      className={[
        "rounded-xl bg-blue-50 px-4 py-3",
        wide ? "w-full" : "min-w-[220px] flex-1",
      ].join(" ")}
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
        {label}
      </p>
      <p className="text-sm font-medium leading-relaxed text-slate-800 break-words">
        {value || "-"}
      </p>
    </div>
  );
}

function RecordList({ records, getKey, renderItem }) {
  return (
    <div className="flex flex-col gap-4">
      {records.map((record) => (
        <div key={getKey(record)}>{renderItem(record)}</div>
      ))}
    </div>
  );
}

function DetailCard({ title, items, imagePath }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-blue-50">
      <div className="border-b border-blue-100 bg-white px-4 py-3">
        <h3 className="text-sm font-semibold text-blue-700">{title}</h3>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-wrap gap-4">
          {items.map((item, index) => (
            <Info
              key={`${item.label}-${index}`}
              label={item.label}
              value={item.value}
              wide={item.wide}
            />
          ))}
        </div>

        {imagePath && <ImagePreview src={imagePath} />}
      </div>
    </div>
  );
}

function ImagePreview({ src }) {
  const resolvedSrc = resolveImageUrl(src);

  if (!resolvedSrc) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-xl border border-blue-200 bg-white">
        <img
          src={resolvedSrc}
          alt="medical attachment"
          className="h-48 w-full cursor-pointer object-cover transition hover:scale-105"
          onClick={() => window.open(resolvedSrc, "_blank")}
        />
      </div>
      <p className="text-center text-xs font-medium text-blue-600">
        Click image to view full size
      </p>
    </div>
  );
}

function DocumentPreview({ src }) {
  const resolvedSrc = resolveImageUrl(src);

  if (!resolvedSrc) return null;

  return (
    <button
      type="button"
      onClick={() => window.open(resolvedSrc, "_blank")}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-blue-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <img
        src={resolvedSrc}
        alt="medical document"
        className="h-44 w-full object-cover transition group-hover:scale-105"
      />
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-blue-700">Medical Document</p>
        <p className="text-xs text-slate-500">Tap to open</p>
      </div>
    </button>
  );
}

function PageStatus({ title, message, variant = "loading", action }) {
  const accentClass =
    variant === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-blue-200 bg-white text-blue-700";

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div
        className={`w-full max-w-md rounded-2xl border p-6 text-center shadow-sm ${accentClass}`}
      >
        {variant === "loading" && (
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        )}

        <h2 className="mb-2 text-lg font-bold">{title}</h2>
        <p className="text-sm leading-relaxed">{message}</p>

        {action && <div className="mt-5 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatArray(value) {
  if (!Array.isArray(value) || value.length === 0) return "-";
  return value.join(", ");
}

function formatLabel(value) {
  if (!value) return "-";

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatUnit(value, unit, addSpace = true) {
  if (value === null || value === undefined || value === "") return "-";
  return addSpace ? `${value} ${unit}` : `${value}${unit}`;
}