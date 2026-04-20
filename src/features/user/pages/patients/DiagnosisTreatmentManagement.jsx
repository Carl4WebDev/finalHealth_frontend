import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDiagnosisTreatment } from "../../context/diagnosis-treatments/useDiagnosisTreatment";
import { useNavigate } from "react-router-dom";

export default function DiagnosisTreatmentManagement() {
  
  const navigate = useNavigate()
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