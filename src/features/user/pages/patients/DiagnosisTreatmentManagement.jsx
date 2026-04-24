import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDiagnosisTreatment } from "../../context/diagnosis-treatments/useDiagnosisTreatment";
import { useNavigate } from "react-router-dom";

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

  const [isAddDiagnosisOpen, setIsAddDiagnosisOpen] = useState(false);
  const [isEditDiagnosisOpen, setIsEditDiagnosisOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  const [isAddTreatmentOpen, setIsAddTreatmentOpen] = useState(false);
  const [isEditTreatmentOpen, setIsEditTreatmentOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  // UI ONLY STATES
  const [feesOptions, setFeesOptions] = useState([]);
  const [prescriptionOptions, setPrescriptionOptions] = useState([]);
  const [labResultOptions, setLabResultOptions] = useState([]);
  const [certificateOptions, setCertificateOptions] = useState([]);

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
  }, []);

  const openEditDiagnosis = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setIsEditDiagnosisOpen(true);
  };

  const openEditTreatment = (treatment) => {
    setSelectedTreatment(treatment);
    setIsEditTreatmentOpen(true);
  };

  // UI ONLY HANDLERS
  const addSimpleItem = async (setter, value, keyName) => {
    setter((prev) => [
      ...prev,
      {
        id: Date.now(),
        [keyName]: value,
      },
    ]);
    return true;
  };

  const updateSimpleItem = async (setter, id, value, keyName) => {
    setter((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [keyName]: value } : item
      )
    );
    return true;
  };

  
  const deleteSimpleItem = (setter, id) => {
    setter((prev) => prev.filter((item) => item.id !== id));
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

          {/* Fees Management */}
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
  {feesOptions.length === 0 ? (
    <tr>
      <td colSpan="3" className="p-4 text-center text-gray-500">
        No fees found
      </td>
    </tr>
  ) : (
    feesOptions.map((item) => (
      <tr key={item.id} className="border-t">
        <td className="p-3">{item.fee_name}</td>

        <td className="p-3">
          ₱ {Number(item.amount || 0).toFixed(2)}
        </td>

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
              onClick={() =>
                deleteSimpleItem(setFeesOptions, item.id)
              }
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

            <div className="border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Prescription</th>
                    <th className="p-3 text-left w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptionOptions.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="p-4 text-center text-gray-500">
                        No prescriptions found
                      </td>
                    </tr>
                  ) : (
                    prescriptionOptions.map((item) => (
                      <tr key={item.id} className="border-t">
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
                                deleteSimpleItem(setPrescriptionOptions, item.id)
                              }
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
                  Lab Results Management
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

            <div className="border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Lab Result</th>
                    <th className="p-3 text-left w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {labResultOptions.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="p-4 text-center text-gray-500">
                        No lab results found
                      </td>
                    </tr>
                  ) : (
                    labResultOptions.map((item) => (
                      <tr key={item.id} className="border-t">
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
                                deleteSimpleItem(setLabResultOptions, item.id)
                              }
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
                  Certificates Management
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

            <div className="border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Certificate</th>
                    <th className="p-3 text-left w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificateOptions.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="p-4 text-center text-gray-500">
                        No certificates found
                      </td>
                    </tr>
                  ) : (
                    certificateOptions.map((item) => (
                      <tr key={item.id} className="border-t">
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
                                deleteSimpleItem(setCertificateOptions, item.id)
                              }
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

        <AddDiagnosisModal
          isOpen={isAddDiagnosisOpen}
          onClose={() => setIsAddDiagnosisOpen(false)}
          onSubmit={createDiagnosis}
          loading={diagnosisActionLoading}
        />

        <EditDiagnosisModal
          isOpen={isEditDiagnosisOpen}
          onClose={() => {
            setIsEditDiagnosisOpen(false);
            setSelectedDiagnosis(null);
          }}
          diagnosis={selectedDiagnosis}
          onSubmit={updateDiagnosis}
          loading={diagnosisActionLoading}
        />

        <AddTreatmentModal
          isOpen={isAddTreatmentOpen}
          onClose={() => setIsAddTreatmentOpen(false)}
          onSubmit={createTreatment}
          loading={treatmentActionLoading}
        />

        <EditTreatmentModal
          isOpen={isEditTreatmentOpen}
          onClose={() => {
            setIsEditTreatmentOpen(false);
            setSelectedTreatment(null);
          }}
          treatment={selectedTreatment}
          onSubmit={updateTreatment}
          loading={treatmentActionLoading}
        />

 <AddFeeModal
  isOpen={isAddFeeOpen}
  onClose={() => setIsAddFeeOpen(false)}
  onSubmit={async (data) => {
    setFeesOptions((prev) => [
      ...prev,
      {
        id: Date.now(),
        fee_name: data.fee_name,
        amount: data.amount,
      },
    ]);
    return true;
  }}
/>

        <EditSimpleOptionModal
          isOpen={isEditFeeOpen}
          onClose={() => {
            setIsEditFeeOpen(false);
            setSelectedFee(null);
          }}
          title="Edit Fee"
          placeholder="Enter fee name"
          item={selectedFee}
          valueKey="fee_name"
          onSubmit={(id, value) =>
            updateSimpleItem(setFeesOptions, id, value, "fee_name")
          }
        />

        <AddSimpleOptionModal
          isOpen={isAddPrescriptionOpen}
          onClose={() => setIsAddPrescriptionOpen(false)}
          title="Add Prescription"
          placeholder="Enter prescription name"
          onSubmit={(value) =>
            addSimpleItem(
              setPrescriptionOptions,
              value,
              "prescription_name"
            )
          }
        />

        <EditSimpleOptionModal
          isOpen={isEditPrescriptionOpen}
          onClose={() => {
            setIsEditPrescriptionOpen(false);
            setSelectedPrescription(null);
          }}
          title="Edit Prescription"
          placeholder="Enter prescription name"
          item={selectedPrescription}
          valueKey="prescription_name"
          onSubmit={(id, value) =>
            updateSimpleItem(
              setPrescriptionOptions,
              id,
              value,
              "prescription_name"
            )
          }
        />

        <AddSimpleOptionModal
          isOpen={isAddLabResultOpen}
          onClose={() => setIsAddLabResultOpen(false)}
          title="Add Lab Result"
          placeholder="Enter lab result name"
          onSubmit={(value) =>
            addSimpleItem(setLabResultOptions, value, "lab_result_name")
          }
        />

        <EditSimpleOptionModal
          isOpen={isEditLabResultOpen}
          onClose={() => {
            setIsEditLabResultOpen(false);
            setSelectedLabResult(null);
          }}
          title="Edit Lab Result"
          placeholder="Enter lab result name"
          item={selectedLabResult}
          valueKey="lab_result_name"
          onSubmit={(id, value) =>
            updateSimpleItem(setLabResultOptions, id, value, "lab_result_name")
          }
        />

        <AddSimpleOptionModal
          isOpen={isAddCertificateOpen}
          onClose={() => setIsAddCertificateOpen(false)}
          title="Add Certificate"
          placeholder="Enter certificate name"
          onSubmit={(value) =>
            addSimpleItem(setCertificateOptions, value, "certificate_name")
          }
        />

        <EditSimpleOptionModal
          isOpen={isEditCertificateOpen}
          onClose={() => {
            setIsEditCertificateOpen(false);
            setSelectedCertificate(null);
          }}
          title="Edit Certificate"
          placeholder="Enter certificate name"
          item={selectedCertificate}
          valueKey="certificate_name"
          onSubmit={(id, value) =>
            updateSimpleItem(
              setCertificateOptions,
              id,
              value,
              "certificate_name"
            )
          }
        />
      </div>
    </Layout>
  );
}

/* ---------------- MODALS ---------------- */

function AddDiagnosisModal({ isOpen, onClose, onSubmit, loading }) {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!value.trim()) return;

    const ok = await onSubmit(value.trim());
    if (ok) {
      setValue("");
      onClose();
    }
  };

  return (
    <ModalShell title="Add Diagnosis" onClose={onClose}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter diagnosis name"
        className="w-full border rounded-lg px-3 py-2"
      />

      <ModalActions
        onClose={onClose}
        onSave={handleSave}
        saveLabel={loading ? "Saving..." : "Save"}
      />
    </ModalShell>
  );
}

function EditDiagnosisModal({
  isOpen,
  onClose,
  diagnosis,
  onSubmit,
  loading,
}) {
  const [value, setValue] = useState("");

  React.useEffect(() => {
    if (diagnosis) {
      setValue(diagnosis.diagnosis_name || "");
    }
  }, [diagnosis]);

  if (!isOpen || !diagnosis) return null;

  const handleSave = async () => {
    if (!value.trim()) return;

    const ok = await onSubmit(diagnosis.diagnosis_id, value.trim());
    if (ok) {
      onClose();
    }
  };

  return (
    <ModalShell title="Edit Diagnosis" onClose={onClose}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter diagnosis name"
        className="w-full border rounded-lg px-3 py-2"
      />

      <ModalActions
        onClose={onClose}
        onSave={handleSave}
        saveLabel={loading ? "Updating..." : "Update"}
      />
    </ModalShell>
  );
}

function AddTreatmentModal({ isOpen, onClose, onSubmit, loading }) {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!value.trim()) return;

    const ok = await onSubmit(value.trim());
    if (ok) {
      setValue("");
      onClose();
    }
  };

  return (
    <ModalShell title="Add Treatment" onClose={onClose}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter treatment name"
        className="w-full border rounded-lg px-3 py-2"
      />

      <ModalActions
        onClose={onClose}
        onSave={handleSave}
        saveLabel={loading ? "Saving..." : "Save"}
      />
    </ModalShell>
  );
}

function EditTreatmentModal({
  isOpen,
  onClose,
  treatment,
  onSubmit,
  loading,
}) {
  const [value, setValue] = useState("");

  React.useEffect(() => {
    if (treatment) {
      setValue(treatment.treatment_name || "");
    }
  }, [treatment]);

  if (!isOpen || !treatment) return null;

  const handleSave = async () => {
    if (!value.trim()) return;

    const ok = await onSubmit(treatment.treatment_id, value.trim());
    if (ok) {
      onClose();
    }
  };

  return (
    <ModalShell title="Edit Treatment" onClose={onClose}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter treatment name"
        className="w-full border rounded-lg px-3 py-2"
      />

      <ModalActions
        onClose={onClose}
        onSave={handleSave}
        saveLabel={loading ? "Updating..." : "Update"}
      />
    </ModalShell>
  );
}

/* ---------------- SIMPLE UI ONLY MODALS ---------------- */
function AddFeeModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim() || !amount) return;

    const ok = await onSubmit({
      fee_name: name.trim(),
      amount: Number(amount),
    });

    if (ok) {
      setName("");
      setAmount("");
      onClose();
    }
  };

  return (
    <ModalShell title="Add Fee" onClose={onClose}>
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Fee name (e.g. Consultation)"
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <ModalActions onClose={onClose} onSave={handleSave} saveLabel="Save" />
    </ModalShell>
  );
}
function EditFeeModal({ isOpen, onClose, fee, onSubmit }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (fee) {
      setName(fee.fee_name || "");
      setAmount(fee.amount || "");
    }
  }, [fee]);

  if (!isOpen || !fee) return null;

  const handleSave = async () => {
    if (!name.trim() || !amount) return;

    const ok = await onSubmit(fee.id, {
      fee_name: name.trim(),
      amount: Number(amount),
    });

    if (ok) {
      onClose();
    }
  };

  return (
    <ModalShell title="Edit Fee" onClose={onClose}>
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Fee name"
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <ModalActions onClose={onClose} onSave={handleSave} saveLabel="Update" />
    </ModalShell>
  );
}

function AddSimpleOptionModal({
  isOpen,
  onClose,
  title,
  placeholder,
  onSubmit,
}) {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!value.trim()) return;

    const ok = await onSubmit(value.trim());
    if (ok) {
      setValue("");
      onClose();
    }
  };

  return (
    <ModalShell title={title} onClose={onClose}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2"
      />

      <ModalActions onClose={onClose} onSave={handleSave} saveLabel="Save" />
    </ModalShell>
  );
}

function EditSimpleOptionModal({
  isOpen,
  onClose,
  title,
  placeholder,
  item,
  valueKey,
  onSubmit,
}) {
  const [value, setValue] = useState("");

  React.useEffect(() => {
    if (item) {
      setValue(item[valueKey] || "");
    }
  }, [item, valueKey]);

  if (!isOpen || !item) return null;

  const handleSave = async () => {
    if (!value.trim()) return;

    const ok = await onSubmit(item.id, value.trim());
    if (ok) {
      onClose();
    }
  };

  return (
    <ModalShell title={title} onClose={onClose}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2"
      />

      <ModalActions onClose={onClose} onSave={handleSave} saveLabel="Update" />
    </ModalShell>
  );
}

/* ---------------- REUSABLE MODAL PARTS ---------------- */

function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function ModalActions({ onClose, onSave, saveLabel }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button
        onClick={onClose}
        className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        {saveLabel}
      </button>
    </div>
  );
}