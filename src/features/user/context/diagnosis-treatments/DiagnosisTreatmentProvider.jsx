import { useState, useCallback, useMemo } from "react";
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

  const getAllDiagnoses = useCallback(async () => {
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
  }, []);

  const createDiagnosis = useCallback(async (diagnosisName) => {
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
  }, [getAllDiagnoses]);

  const updateDiagnosis = useCallback(async (diagnosisId, diagnosisName) => {
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
  }, [getAllDiagnoses]);

  const deleteDiagnosis = useCallback(async (diagnosisId) => {
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
  }, [getAllDiagnoses]);

  const getAllTreatments = useCallback(async () => {
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
  }, []);

  const createTreatment = useCallback(async (treatmentName) => {
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
  }, [getAllTreatments]);

  const updateTreatment = useCallback(async (treatmentId, treatmentName) => {
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
  }, [getAllTreatments]);

  const deleteTreatment = useCallback(async (treatmentId) => {
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
  }, [getAllTreatments]);

  const clearDiagnosisTreatment = useCallback(() => {
    setDiagnoses([]);
    setTreatments([]);
    setDiagnosisError(null);
    setTreatmentError(null);
  }, []);

  const value = useMemo(() => ({
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
  }), [
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
  ]);

  return (
    <DiagnosisTreatmentContext.Provider value={value}>
      {children}
    </DiagnosisTreatmentContext.Provider>
  );
};
