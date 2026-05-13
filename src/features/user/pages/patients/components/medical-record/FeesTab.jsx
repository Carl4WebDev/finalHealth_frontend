import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMedicalRecords } from "../../../../context/medical-records/useMedicalRecords.js";
import { useFeeMaster } from "../../../../context/fee-master/useFeeMaster.js";

export default function FeesTab({ medicalRecord }) {
  const navigate = useNavigate();

  const { updateMedicalRecord, getMedicalRecordByAppointmentId } =
    useMedicalRecords();

  const { fees, getAllFees } = useFeeMaster();

  const [feesList, setFeesList] = useState([]);
  const [selectedFeeType, setSelectedFeeType] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");

  const feeOptions = fees || [];

  const formatDate = (dateValue) => {
    if (!dateValue) return new Date().toLocaleDateString();
    return new Date(dateValue).toLocaleDateString();
  };

  useEffect(() => {
    getAllFees();
  }, []);

  useEffect(() => {
    if (!medicalRecord) return;

    const fees = [
      {
        id: 1,
        feeType: "Consultation Fee",
        amount: Number(medicalRecord.consultation_fee || 0),
      },
      {
        id: 2,
        feeType: "Medication Fee",
        amount: Number(medicalRecord.medicine_fee || 0),
      },
      {
        id: 3,
        feeType: "Lab Fee",
        amount: Number(medicalRecord.lab_fee || 0),
      },
      {
        id: 4,
        feeType: "Other Fee",
        amount: Number(medicalRecord.other_fee || 0),
      },
    ];

    setFeesList(fees.filter((fee) => fee.amount > 0));
  }, [medicalRecord]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(Number(value || 0));
  };

const buildFeePayload = (list) => {
  const total = list.reduce(
    (sum, fee) => sum + Number(fee.amount || 0),
    0
  );

  return {
    consultation_fee: total,
    medicine_fee: 0,
    lab_fee: 0,
    other_fee: 0,
  };
};

  const saveFeesToBackend = async (updatedFeesList) => {
    if (!medicalRecord?.record_id) return;

    const feePayload = buildFeePayload(updatedFeesList);

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
      pre_employment_data: medicalRecord.pre_employment_data,
      ...feePayload,
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

    await saveFeesToBackend(updatedFeesList);
  };

  const removeFee = async (id) => {
    const updatedFeesList = feesList.filter((fee) => fee.id !== id);
    setFeesList(updatedFeesList);
    await saveFeesToBackend(updatedFeesList);
  };

  const totalAmount = useMemo(() => {
    return feesList.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
  }, [feesList]);

  return (
    <div className="space-y-5">
      <h2 className="text-center text-lg font-semibold text-gray-800">Fees</h2>

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

      <div className="mx-auto max-w-md rounded-xl bg-blue-50 p-4 text-center">
        <p className="text-sm text-gray-600">Total Amount</p>
        <p className="mt-1 text-xl font-bold text-blue-700">
          {formatCurrency(totalAmount)}
        </p>
      </div>
    </div>
  );
}