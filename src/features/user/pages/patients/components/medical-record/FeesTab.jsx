import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMedicalRecords } from "../../../../context/medical-records/useMedicalRecords.js";
import { useFeeMaster } from "../../../../context/fee-master/useFeeMaster.js";

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

export default function FeesTab({ medicalRecord }) {
  const navigate = useNavigate();

  const { updateMedicalRecord, getMedicalRecordByAppointmentId } =
    useMedicalRecords();

  const { fees, getAllFees } = useFeeMaster();

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
            onClick={() => navigate("/user/patients/management")}
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
    </div>
  );
}
