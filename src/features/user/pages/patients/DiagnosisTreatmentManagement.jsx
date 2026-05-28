

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDiagnosisTreatment } from "../../context/diagnosis-treatments/useDiagnosisTreatment";
import { useNavigate } from "react-router-dom";

import { useFeeMaster } from "../../context/fee-master/useFeeMaster";
import { usePrescriptionMaster } from "../../context/prescriptions-master/usePrescriptionMaster";
import { useLabResultMaster } from "../../context/lab-result-master/useLabResultMaster";
import { useCertificateMaster } from "../../context/certificate-master/useCertificateMaster";
import {
  AddTextModal,
  AddFeeModal,
  EditTextModal,
  EditFeeModal,
  ModalShell,
  ModalActions,
  DIAGNOSIS_STANDARD_OPTIONS,
  TREATMENT_STANDARD_OPTIONS,
  PRESCRIPTION_STANDARD_OPTIONS,
  LAB_RESULT_STANDARD_OPTIONS,
  CERTIFICATE_STANDARD_OPTIONS,
  FEE_STANDARD_OPTIONS,
} from "./components/shared/AddItemModal";

export default function DiagnosisTreatmentManagement() {
  const navigate = useNavigate();

  const {
    diagnoses,
    treatments,

    loadingDiagnoses,
    loadingTreatments,
    diagnosisActionLoading,
    treatmentActionLoading,

    diagnosisError,
    treatmentError,

    getAllDiagnoses,
    createDiagnosis,
    updateDiagnosis,
    deleteDiagnosis,

    getAllTreatments,
    createTreatment,
    updateTreatment,
    deleteTreatment,
  } = useDiagnosisTreatment();

  const {
    fees,
    loadingFees,
    feeActionLoading,
    feeError,

    getAllFees,
    createFee,
    updateFee,
    deleteFee,
  } = useFeeMaster();

  const {
    prescriptions,
    loadingPrescriptions,
    prescriptionActionLoading,
    prescriptionError,

    getAllPrescriptionMasters,
    createPrescriptionMaster,
    updatePrescriptionMaster,
    deletePrescriptionMaster,
  } = usePrescriptionMaster();

  const {
    labResults,
    loadingLabResults,
    labResultActionLoading,
    labResultError,

    getAllLabResultMasters,
    createLabResultMaster,
    updateLabResultMaster,
    deleteLabResultMaster,
  } = useLabResultMaster();

  const {
    certificates,
    loadingCertificates,
    certificateActionLoading,
    certificateError,

    getAllCertificateMasters,
    createCertificateMaster,
    updateCertificateMaster,
    deleteCertificateMaster,
  } = useCertificateMaster();

  const [isAddDiagnosisOpen, setIsAddDiagnosisOpen] = useState(false);
  const [isEditDiagnosisOpen, setIsEditDiagnosisOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  const [isAddTreatmentOpen, setIsAddTreatmentOpen] = useState(false);
  const [isEditTreatmentOpen, setIsEditTreatmentOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  const [isAddFeeOpen, setIsAddFeeOpen] = useState(false);
  const [isEditFeeOpen, setIsEditFeeOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const [isAddPrescriptionOpen, setIsAddPrescriptionOpen] = useState(false);
  const [isEditPrescriptionOpen, setIsEditPrescriptionOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [isAddLabResultOpen, setIsAddLabResultOpen] = useState(false);
  const [isEditLabResultOpen, setIsEditLabResultOpen] = useState(false);
  const [selectedLabResult, setSelectedLabResult] = useState(null);

  const [isAddCertificateOpen, setIsAddCertificateOpen] = useState(false);
  const [isEditCertificateOpen, setIsEditCertificateOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    getAllDiagnoses();
    getAllTreatments();

    getAllFees();
    getAllPrescriptionMasters();
    getAllLabResultMasters();
    getAllCertificateMasters();
  }, []);

  const openEditDiagnosis = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setIsEditDiagnosisOpen(true);
  };

  const openEditTreatment = (treatment) => {
    setSelectedTreatment(treatment);
    setIsEditTreatmentOpen(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
        >
          Go Back
        </button>

        <h2 className="text-2xl font-semibold text-slate-800">
          Diagnosis and Treatment Management
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Diagnosis Management */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-700">
                  Diagnosis Management
                </h3>
                <p className="text-sm text-gray-500">
                  Add, edit, and delete diagnosis options.
                </p>
              </div>

              <button
                onClick={() => setIsAddDiagnosisOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add Diagnosis
              </button>
            </div>

            {diagnosisError && (
              <p className="text-sm text-red-600">{diagnosisError}</p>
            )}

            <div className="border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Diagnosis</th>
                    <th className="p-3 text-left w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingDiagnoses ? (
                    <tr>
                      <td colSpan="2" className="p-4 text-center">
                        Loading diagnoses...
                      </td>
                    </tr>
                  ) : diagnoses.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="p-4 text-center text-gray-500">
                        No diagnoses found
                      </td>
                    </tr>
                  ) : (
                    diagnoses.map((item) => (
                      <tr key={item.diagnosis_id} className="border-t">
                        <td className="p-3">{item.diagnosis_name}</td>
                        <td className="p-3">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => openEditDiagnosis(item)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteDiagnosis(item.diagnosis_id)}
                              disabled={diagnosisActionLoading}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Treatment Management */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-700">
                  Treatment Management
                </h3>
                <p className="text-sm text-gray-500">
                  Add, edit, and delete treatment options.
                </p>
              </div>

              <button
                onClick={() => setIsAddTreatmentOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add Treatment
              </button>
            </div>

            {treatmentError && (
              <p className="text-sm text-red-600">{treatmentError}</p>
            )}

            <div className="border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Treatment</th>
                    <th className="p-3 text-left w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTreatments ? (
                    <tr>
                      <td colSpan="2" className="p-4 text-center">
                        Loading treatments...
                      </td>
                    </tr>
                  ) : treatments.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="p-4 text-center text-gray-500">
                        No treatments found
                      </td>
                    </tr>
                  ) : (
                    treatments.map((item) => (
                      <tr key={item.treatment_id} className="border-t">
                        <td className="p-3">{item.treatment_name}</td>
                        <td className="p-3">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => openEditTreatment(item)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTreatment(item.treatment_id)}
                              disabled={treatmentActionLoading}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fees */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-700">
                  Fees Management
                </h3>
                <p className="text-sm text-gray-500">
                  Add, edit, and delete fee dropdown options.
                </p>
              </div>

              <button
                onClick={() => setIsAddFeeOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add Fee
              </button>
            </div>

            {feeError && (
              <p className="text-sm text-red-600">{feeError}</p>
            )}

            <div className="border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Fee Name</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingFees ? (
                    <tr>
                      <td colSpan="3" className="p-4 text-center">
                        Loading fees...
                      </td>
                    </tr>
                  ) : fees.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-gray-500">
                        No fees found
                      </td>
                    </tr>
                  ) : (
                    fees.map((item) => (
                      <tr key={item.fee_id} className="border-t">
                        <td className="p-3">{item.fee_name}</td>
                        <td className="p-3">₱ {Number(item.amount || 0).toFixed(2)}</td>
                        <td className="p-3">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => {
                                setSelectedFee(item);
                                setIsEditFeeOpen(true);
                              }}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteFee(item.fee_id)}
                              disabled={feeActionLoading}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        {/* Prescription Management */}
<div className="bg-white rounded-2xl shadow border border-gray-200 p-5 space-y-5">
  <div className="flex items-start justify-between gap-4">
    <div>
      <h3 className="text-lg font-semibold text-blue-700">
        Prescription Management
      </h3>
      <p className="text-sm text-gray-500">
        Add, edit, and delete prescription dropdown options.
      </p>
    </div>

    <button
      onClick={() => setIsAddPrescriptionOpen(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
    >
      Add Prescription
    </button>
  </div>

  {prescriptionError && (
    <p className="text-sm text-red-600">{prescriptionError}</p>
  )}

  <div className="border rounded-xl overflow-hidden">
    <table className="w-full">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="p-3 text-left">Prescription</th>
          <th className="p-3 text-left w-[180px]">Actions</th>
        </tr>
      </thead>
      <tbody>
        {loadingPrescriptions ? (
          <tr>
            <td colSpan="2" className="p-4 text-center">
              Loading prescriptions...
            </td>
          </tr>
        ) : prescriptions.length === 0 ? (
          <tr>
            <td colSpan="2" className="p-4 text-center text-gray-500">
              No prescriptions found
            </td>
          </tr>
        ) : (
          prescriptions.map((item) => (
            <tr key={item.prescription_id} className="border-t">
              <td className="p-3">{item.prescription_name}</td>
              <td className="p-3">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setSelectedPrescription(item);
                      setIsEditPrescriptionOpen(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      deletePrescriptionMaster(item.prescription_id)
                    }
                    disabled={prescriptionActionLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>

{/* Lab Result Management */}
<div className="bg-white rounded-2xl shadow border border-gray-200 p-5 space-y-5">
  <div className="flex items-start justify-between gap-4">
    <div>
      <h3 className="text-lg font-semibold text-blue-700">
        Lab Result Management
      </h3>
      <p className="text-sm text-gray-500">
        Add, edit, and delete lab result dropdown options.
      </p>
    </div>

    <button
      onClick={() => setIsAddLabResultOpen(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
    >
      Add Lab Result
    </button>
  </div>

  {labResultError && (
    <p className="text-sm text-red-600">{labResultError}</p>
  )}

  <div className="border rounded-xl overflow-hidden">
    <table className="w-full">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="p-3 text-left">Lab Result</th>
          <th className="p-3 text-left w-[180px]">Actions</th>
        </tr>
      </thead>
      <tbody>
        {loadingLabResults ? (
          <tr>
            <td colSpan="2" className="p-4 text-center">
              Loading lab results...
            </td>
          </tr>
        ) : labResults.length === 0 ? (
          <tr>
            <td colSpan="2" className="p-4 text-center text-gray-500">
              No lab results found
            </td>
          </tr>
        ) : (
          labResults.map((item) => (
            <tr key={item.lab_result_id} className="border-t">
              <td className="p-3">{item.lab_result_name}</td>
              <td className="p-3">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setSelectedLabResult(item);
                      setIsEditLabResultOpen(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      deleteLabResultMaster(item.lab_result_id)
                    }
                    disabled={labResultActionLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>

{/* Certificate Management */}
<div className="bg-white rounded-2xl shadow border border-gray-200 p-5 space-y-5">
  <div className="flex items-start justify-between gap-4">
    <div>
      <h3 className="text-lg font-semibold text-blue-700">
        Certificate Management
      </h3>
      <p className="text-sm text-gray-500">
        Add, edit, and delete certificate dropdown options.
      </p>
    </div>

    <button
      onClick={() => setIsAddCertificateOpen(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
    >
      Add Certificate
    </button>
  </div>

  {certificateError && (
    <p className="text-sm text-red-600">{certificateError}</p>
  )}

  <div className="border rounded-xl overflow-hidden">
    <table className="w-full">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="p-3 text-left">Certificate</th>
          <th className="p-3 text-left w-[180px]">Actions</th>
        </tr>
      </thead>
      <tbody>
        {loadingCertificates ? (
          <tr>
            <td colSpan="2" className="p-4 text-center">
              Loading certificates...
            </td>
          </tr>
        ) : certificates.length === 0 ? (
          <tr>
            <td colSpan="2" className="p-4 text-center text-gray-500">
              No certificates found
            </td>
          </tr>
        ) : (
          certificates.map((item) => (
            <tr key={item.certificate_id} className="border-t">
              <td className="p-3">{item.certificate_name}</td>
              <td className="p-3">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setSelectedCertificate(item);
                      setIsEditCertificateOpen(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      deleteCertificateMaster(item.certificate_id)
                    }
                    disabled={certificateActionLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
        </div>

<AddTextModal
  isOpen={isAddDiagnosisOpen}
  title="Add Diagnosis"
  placeholder="Choose or enter diagnosis name"
  loading={diagnosisActionLoading}
  onClose={() => setIsAddDiagnosisOpen(false)}
  onSubmit={createDiagnosis}
  categorizedOptions={DIAGNOSIS_STANDARD_OPTIONS}
/>

<EditTextModal
  isOpen={isEditDiagnosisOpen}
  title="Edit Diagnosis"
  placeholder="Choose or enter diagnosis name"
  item={selectedDiagnosis}
  value={selectedDiagnosis?.diagnosis_name}
  loading={diagnosisActionLoading}
  onClose={() => {
    setIsEditDiagnosisOpen(false);
    setSelectedDiagnosis(null);
  }}
  onSubmit={(value) =>
    updateDiagnosis(selectedDiagnosis.diagnosis_id, value)
  }
  categorizedOptions={DIAGNOSIS_STANDARD_OPTIONS}
/>

<AddTextModal
  isOpen={isAddTreatmentOpen}
  title="Add Treatment"
  placeholder="Choose or enter treatment name"
  loading={treatmentActionLoading}
  onClose={() => setIsAddTreatmentOpen(false)}
  onSubmit={createTreatment}
  categorizedOptions={TREATMENT_STANDARD_OPTIONS}
/>

<EditTextModal
  isOpen={isEditTreatmentOpen}
  title="Edit Treatment"
  placeholder="Choose or enter treatment name"
  item={selectedTreatment}
  value={selectedTreatment?.treatment_name}
  loading={treatmentActionLoading}
  onClose={() => {
    setIsEditTreatmentOpen(false);
    setSelectedTreatment(null);
  }}
  onSubmit={(value) =>
    updateTreatment(selectedTreatment.treatment_id, value)
  }
  categorizedOptions={TREATMENT_STANDARD_OPTIONS}
/>

<AddFeeModal
  isOpen={isAddFeeOpen}
  loading={feeActionLoading}
  onClose={() => setIsAddFeeOpen(false)}
  onSubmit={createFee}
  categorizedOptions={FEE_STANDARD_OPTIONS}
/>

<EditFeeModal
  isOpen={isEditFeeOpen}
  fee={selectedFee}
  loading={feeActionLoading}
  onClose={() => {
    setIsEditFeeOpen(false);
    setSelectedFee(null);
  }}
  onSubmit={(data) => updateFee(selectedFee.fee_id, data)}
  categorizedOptions={FEE_STANDARD_OPTIONS}
/>
<AddTextModal
  isOpen={isAddPrescriptionOpen}
  title="Add Prescription"
  placeholder="Choose or enter prescription name"
  loading={prescriptionActionLoading}
  onClose={() => setIsAddPrescriptionOpen(false)}
  onSubmit={createPrescriptionMaster}
  categorizedOptions={PRESCRIPTION_STANDARD_OPTIONS}
/>
<EditTextModal
  isOpen={isEditPrescriptionOpen}
  title="Edit Prescription"
  placeholder="Choose or enter prescription name"
  item={selectedPrescription}
  value={selectedPrescription?.prescription_name}
  loading={prescriptionActionLoading}
  onClose={() => {
    setIsEditPrescriptionOpen(false);
    setSelectedPrescription(null);
  }}
  onSubmit={(value) =>
    updatePrescriptionMaster(selectedPrescription.prescription_id, value)
  }
  categorizedOptions={PRESCRIPTION_STANDARD_OPTIONS}
/>

<AddTextModal
  isOpen={isAddLabResultOpen}
  title="Add Lab Result"
  placeholder="Choose or enter lab result name"
  loading={labResultActionLoading}
  onClose={() => setIsAddLabResultOpen(false)}
  onSubmit={createLabResultMaster}
  categorizedOptions={LAB_RESULT_STANDARD_OPTIONS}
/>
<EditTextModal
  isOpen={isEditLabResultOpen}
  title="Edit Lab Result"
  placeholder="Choose or enter lab result name"
  item={selectedLabResult}
  value={selectedLabResult?.lab_result_name}
  loading={labResultActionLoading}
  onClose={() => {
    setIsEditLabResultOpen(false);
    setSelectedLabResult(null);
  }}
  onSubmit={(value) =>
    updateLabResultMaster(selectedLabResult.lab_result_id, value)
  }
  categorizedOptions={LAB_RESULT_STANDARD_OPTIONS}
/>

<AddTextModal
  isOpen={isAddCertificateOpen}
  title="Add Certificate"
  placeholder="Choose or enter certificate name"
  loading={certificateActionLoading}
  onClose={() => setIsAddCertificateOpen(false)}
  onSubmit={createCertificateMaster}
  categorizedOptions={CERTIFICATE_STANDARD_OPTIONS}
/>

<EditTextModal
  isOpen={isEditCertificateOpen}
  title="Edit Certificate"
  placeholder="Choose or enter certificate name"
  item={selectedCertificate}
  value={selectedCertificate?.certificate_name}
  loading={certificateActionLoading}
  onClose={() => {
    setIsEditCertificateOpen(false);
    setSelectedCertificate(null);
  }}
  onSubmit={(value) =>
    updateCertificateMaster(selectedCertificate.certificate_id, value)
  }
  categorizedOptions={CERTIFICATE_STANDARD_OPTIONS}
/>


      </div>
    </Layout>

  );
  
}

