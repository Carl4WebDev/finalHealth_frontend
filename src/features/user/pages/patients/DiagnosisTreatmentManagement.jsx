

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDiagnosisTreatment } from "../../context/diagnosis-treatments/useDiagnosisTreatment";
import { useNavigate } from "react-router-dom";

import { useFeeMaster } from "../../context/fee-master/useFeeMaster";
import { usePrescriptionMaster } from "../../context/prescriptions-master/usePrescriptionMaster";
import { useLabResultMaster } from "../../context/lab-result-master/useLabResultMaster";
import { useCertificateMaster } from "../../context/certificate-master/useCertificateMaster";
import { useCategorizedOptions } from "../../context/useCategorizedOptions";
import {
  AddTextModal,
  AddFeeModal,
  EditTextModal,
  EditFeeModal,
  ModalShell,
  ModalActions,
} from "./components/shared/AddItemModal";

/* ================= CATEGORIZED OPTIONS MANAGEMENT ================= */

const OPTION_SETS = [
  { key: "diagnosis", label: "Diagnosis", color: "blue" },
  { key: "treatment", label: "Treatment", color: "green" },
  { key: "prescription", label: "Prescription", color: "purple" },
  { key: "labResult", label: "Lab Result", color: "orange" },
  { key: "certificate", label: "Certificate", color: "teal" },
  { key: "fee", label: "Fee", color: "pink" },
];

function CategorizedOptionsManager({ categorizedOptions }) {
  const {
    getOptions,
    addCategory,
    renameCategory,
    deleteCategory,
    addOption,
    updateOption,
    deleteOption,
    resetToDefaults,
  } = categorizedOptions;

  const [activeTab, setActiveTab] = useState("diagnosis");
  const [expandedCategory, setExpandedCategory] = useState(null);

  /* modal state */
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState("add"); // add | edit
  const [categoryInput, setCategoryInput] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const [showOptionModal, setShowOptionModal] = useState(false);
  const [optionModalMode, setOptionModalMode] = useState("add"); // add | edit
  const [optionInput, setOptionInput] = useState("");
  const [editingOption, setEditingOption] = useState(null);
  const [optionTargetCategory, setOptionTargetCategory] = useState(null);

  const options = getOptions(activeTab);

  /* ---- handlers ---- */

  const openAddCategory = () => {
    setCategoryModalMode("add");
    setCategoryInput("");
    setShowCategoryModal(true);
  };

  const openEditCategory = (cat) => {
    setCategoryModalMode("edit");
    setEditingCategory(cat.category);
    setCategoryInput(cat.category);
    setShowCategoryModal(true);
  };

  const saveCategory = () => {
    const name = categoryInput.trim();
    if (!name) return;
    if (categoryModalMode === "add") {
      addCategory(activeTab, name);
    } else {
      renameCategory(activeTab, editingCategory, name);
    }
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (cat) => {
    if (
      !window.confirm(
        `Delete category "${cat.category}" and all its options?`
      )
    )
      return;
    deleteCategory(activeTab, cat.category);
    if (expandedCategory === cat.category) setExpandedCategory(null);
  };

  const openAddOption = (categoryName) => {
    setOptionModalMode("add");
    setOptionTargetCategory(categoryName);
    setOptionInput("");
    setShowOptionModal(true);
  };

  const openEditOption = (categoryName, opt) => {
    setOptionModalMode("edit");
    setOptionTargetCategory(categoryName);
    setEditingOption(opt);
    setOptionInput(opt);
    setShowOptionModal(true);
  };

  const saveOption = () => {
    const name = optionInput.trim();
    if (!name) return;
    if (optionModalMode === "add") {
      addOption(activeTab, optionTargetCategory, name);
    } else {
      updateOption(activeTab, optionTargetCategory, editingOption, name);
    }
    setShowOptionModal(false);
  };

  const handleDeleteOption = (categoryName, opt) => {
    if (!window.confirm(`Delete option "${opt}"?`)) return;
    deleteOption(activeTab, categoryName, opt);
  };

  const tabDef = OPTION_SETS.find((s) => s.key === activeTab);

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Categorized Options
          </h3>
          <p className="text-sm text-gray-500">
            Manage the dropdown categories and options shown in the add-item
            modals.
          </p>
        </div>
        <button
          onClick={resetToDefaults}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Reset to Defaults
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {OPTION_SETS.map((set) => (
          <button
            key={set.key}
            onClick={() => {
              setActiveTab(set.key);
              setExpandedCategory(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === set.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {set.label}
          </button>
        ))}
      </div>

      {/* Add category button */}
      <div className="flex justify-end">
        <button
          onClick={openAddCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg"
        >
          + Add Category
        </button>
      </div>

      {/* Categories accordion */}
      {options.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          No categories yet. Click "Add Category" to create one.
        </p>
      ) : (
        <div className="space-y-2">
          {options.map((cat) => (
            <div
              key={cat.category}
              className="border rounded-xl overflow-hidden"
            >
              {/* Category header */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5">
                <button
                  onClick={() =>
                    setExpandedCategory(
                      expandedCategory === cat.category
                        ? null
                        : cat.category
                    )
                  }
                  className="flex items-center gap-2 text-left flex-1"
                >
                  <span className="text-gray-400 text-xs">
                    {expandedCategory === cat.category ? "▼" : "▶"}
                  </span>
                  <span className="font-medium text-slate-700 text-sm">
                    {cat.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({cat.options.length})
                  </span>
                </button>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEditCategory(cat)}
                    className="text-xs text-yellow-600 hover:text-yellow-700 px-2 py-1 rounded hover:bg-yellow-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Options list */}
              {expandedCategory === cat.category && (
                <div className="px-4 py-3 space-y-2">
                  {cat.options.length === 0 ? (
                    <p className="text-xs text-gray-400">
                      No options in this category.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {cat.options.map((opt) => (
                        <div
                          key={opt}
                          className="flex items-center gap-1 bg-gray-100 rounded-lg px-2.5 py-1 text-sm"
                        >
                          <span className="text-slate-700">{opt}</span>
                          <button
                            onClick={() => openEditOption(cat.category, opt)}
                            className="text-yellow-500 hover:text-yellow-600 ml-1 text-xs"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteOption(cat.category, opt)
                            }
                            className="text-red-400 hover:text-red-500 text-xs"
                            title="Delete"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => openAddOption(cat.category)}
                    className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Category modal */}
      {showCategoryModal && (
        <ModalShell
          title={categoryModalMode === "add" ? "Add Category" : "Edit Category"}
          onClose={() => setShowCategoryModal(false)}
        >
          <input
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            placeholder="Category name"
            className="w-full border rounded-lg px-3 py-2"
            autoFocus
          />
          <ModalActions
            onClose={() => setShowCategoryModal(false)}
            onSave={saveCategory}
            saveLabel="Save"
          />
        </ModalShell>
      )}

      {/* Option modal */}
      {showOptionModal && (
        <ModalShell
          title={optionModalMode === "add" ? "Add Option" : "Edit Option"}
          onClose={() => setShowOptionModal(false)}
        >
          <p className="text-xs text-gray-500">
            Category: <strong>{optionTargetCategory}</strong>
          </p>
          <input
            value={optionInput}
            onChange={(e) => setOptionInput(e.target.value)}
            placeholder="Option name"
            className="w-full border rounded-lg px-3 py-2"
            autoFocus
          />
          <ModalActions
            onClose={() => setShowOptionModal(false)}
            onSave={saveOption}
            saveLabel="Save"
          />
        </ModalShell>
      )}
    </div>
  );
}

/* ================= MAIN PAGE ================= */

export default function DiagnosisTreatmentManagement() {
  const navigate = useNavigate();
  const categorizedOptions = useCategorizedOptions();

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

        {/* ---- Categorized Options Management ---- */}
        <CategorizedOptionsManager categorizedOptions={categorizedOptions} />

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
  categorizedOptions={categorizedOptions.getOptions("diagnosis")}
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
  categorizedOptions={categorizedOptions.getOptions("diagnosis")}
/>

<AddTextModal
  isOpen={isAddTreatmentOpen}
  title="Add Treatment"
  placeholder="Choose or enter treatment name"
  loading={treatmentActionLoading}
  onClose={() => setIsAddTreatmentOpen(false)}
  onSubmit={createTreatment}
  categorizedOptions={categorizedOptions.getOptions("treatment")}
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
  categorizedOptions={categorizedOptions.getOptions("treatment")}
/>

<AddFeeModal
  isOpen={isAddFeeOpen}
  loading={feeActionLoading}
  onClose={() => setIsAddFeeOpen(false)}
  onSubmit={createFee}
  categorizedOptions={categorizedOptions.getOptions("fee")}
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
  categorizedOptions={categorizedOptions.getOptions("fee")}
/>
<AddTextModal
  isOpen={isAddPrescriptionOpen}
  title="Add Prescription"
  placeholder="Choose or enter prescription name"
  loading={prescriptionActionLoading}
  onClose={() => setIsAddPrescriptionOpen(false)}
  onSubmit={createPrescriptionMaster}
  categorizedOptions={categorizedOptions.getOptions("prescription")}
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
  categorizedOptions={categorizedOptions.getOptions("prescription")}
/>

<AddTextModal
  isOpen={isAddLabResultOpen}
  title="Add Lab Result"
  placeholder="Choose or enter lab result name"
  loading={labResultActionLoading}
  onClose={() => setIsAddLabResultOpen(false)}
  onSubmit={createLabResultMaster}
  categorizedOptions={categorizedOptions.getOptions("labResult")}
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
  categorizedOptions={categorizedOptions.getOptions("labResult")}
/>

<AddTextModal
  isOpen={isAddCertificateOpen}
  title="Add Certificate"
  placeholder="Choose or enter certificate name"
  loading={certificateActionLoading}
  onClose={() => setIsAddCertificateOpen(false)}
  onSubmit={createCertificateMaster}
  categorizedOptions={categorizedOptions.getOptions("certificate")}
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
  categorizedOptions={categorizedOptions.getOptions("certificate")}
/>


      </div>
    </Layout>

  );

}
