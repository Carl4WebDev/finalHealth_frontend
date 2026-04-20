import { useState } from "react";
import { DiagnosisTreatmentContext } from "./DiagnosisTreatmentContext.jsx";
import {
  getAllDiagnosesApi,
  createDiagnosisApi,
  updateDiagnosisApi,
  deleteDiagnosisApi,
  getAllTreatmentsApi,
  createTreatmentApi,
  updateTreatmentApi,
  deleteTreatmentApi,
} from "../../api/diagnosisTreatmentApi.js";

export const DiagnosisTreatmentProvider = ({ children }) => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [treatments, setTreatments] = useState([]);

  const [loadingDiagnoses, setLoadingDiagnoses] = useState(false);
  const [loadingTreatments, setLoadingTreatments] = useState(false);

  const [diagnosisError, setDiagnosisError] = useState(null);
  const [treatmentError, setTreatmentError] = useState(null);

  const [diagnosisActionLoading, setDiagnosisActionLoading] = useState(false);
  const [treatmentActionLoading, setTreatmentActionLoading] = useState(false);

  const getAllDiagnoses = async () => {
    setLoadingDiagnoses(true);
    setDiagnosisError(null);

    const res = await getAllDiagnosesApi();

    if (!res.ok) {
      setDiagnosisError(res.message);
      setLoadingDiagnoses(false);
      return;
    }

    setDiagnoses(res.data.diagnoses || []);
    setLoadingDiagnoses(false);
  };

  const createDiagnosis = async (diagnosisName) => {
    setDiagnosisActionLoading(true);
    setDiagnosisError(null);

    const res = await createDiagnosisApi({ diagnosisName });

    if (!res.ok) {
      setDiagnosisError(res.message);
      setDiagnosisActionLoading(false);
      return false;
    }

    await getAllDiagnoses();
    setDiagnosisActionLoading(false);
    return true;
  };

  const updateDiagnosis = async (diagnosisId, diagnosisName) => {
    setDiagnosisActionLoading(true);
    setDiagnosisError(null);

    const res = await updateDiagnosisApi(diagnosisId, { diagnosisName });

    if (!res.ok) {
      setDiagnosisError(res.message);
      setDiagnosisActionLoading(false);
      return false;
    }

    await getAllDiagnoses();
    setDiagnosisActionLoading(false);
    return true;
  };

  const deleteDiagnosis = async (diagnosisId) => {
    setDiagnosisActionLoading(true);
    setDiagnosisError(null);

    const res = await deleteDiagnosisApi(diagnosisId);

    if (!res.ok) {
      setDiagnosisError(res.message);
      setDiagnosisActionLoading(false);
      return false;
    }

    await getAllDiagnoses();
    setDiagnosisActionLoading(false);
    return true;
  };

  const getAllTreatments = async () => {
    setLoadingTreatments(true);
    setTreatmentError(null);

    const res = await getAllTreatmentsApi();

    if (!res.ok) {
      setTreatmentError(res.message);
      setLoadingTreatments(false);
      return;
    }

    setTreatments(res.data.treatments || []);
    setLoadingTreatments(false);
  };

  const createTreatment = async (treatmentName) => {
    setTreatmentActionLoading(true);
    setTreatmentError(null);

    const res = await createTreatmentApi({ treatmentName });

    if (!res.ok) {
      setTreatmentError(res.message);
      setTreatmentActionLoading(false);
      return false;
    }

    await getAllTreatments();
    setTreatmentActionLoading(false);
    return true;
  };

  const updateTreatment = async (treatmentId, treatmentName) => {
    setTreatmentActionLoading(true);
    setTreatmentError(null);

    const res = await updateTreatmentApi(treatmentId, { treatmentName });

    if (!res.ok) {
      setTreatmentError(res.message);
      setTreatmentActionLoading(false);
      return false;
    }

    await getAllTreatments();
    setTreatmentActionLoading(false);
    return true;
  };

  const deleteTreatment = async (treatmentId) => {
    setTreatmentActionLoading(true);
    setTreatmentError(null);

    const res = await deleteTreatmentApi(treatmentId);

    if (!res.ok) {
      setTreatmentError(res.message);
      setTreatmentActionLoading(false);
      return false;
    }

    await getAllTreatments();
    setTreatmentActionLoading(false);
    return true;
  };

  const clearDiagnosisTreatment = () => {
    setDiagnoses([]);
    setTreatments([]);
    setDiagnosisError(null);
    setTreatmentError(null);
  };

  return (
    <DiagnosisTreatmentContext.Provider
      value={{
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

        clearDiagnosisTreatment,
      }}
    >
      {children}
    </DiagnosisTreatmentContext.Provider>
  );
};