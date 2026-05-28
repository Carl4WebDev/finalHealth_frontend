import { useState, useCallback, useMemo } from "react";
import { LabResultMasterContext } from "./LabResultMasterContext.jsx";

import {
  getAllLabResultMastersApi,
  createLabResultMasterApi,
  updateLabResultMasterApi,
  deleteLabResultMasterApi,
} from "../../api/labResultMasterApi.js";

export const LabResultMasterProvider = ({ children }) => {
  const [labResults, setLabResults] = useState([]);
  const [loadingLabResults, setLoadingLabResults] = useState(false);
  const [labResultActionLoading, setLabResultActionLoading] = useState(false);
  const [labResultError, setLabResultError] = useState(null);

  const getAllLabResultMasters = useCallback(async () => {
    setLoadingLabResults(true);
    setLabResultError(null);

    const res = await getAllLabResultMastersApi();

    if (!res.ok) {
      setLabResultError(res.message);
      setLoadingLabResults(false);
      return;
    }

    setLabResults(res.data.labResults || []);
    setLoadingLabResults(false);
  }, []);

  const createLabResultMaster = useCallback(async (lab_result_name) => {
    setLabResultActionLoading(true);
    setLabResultError(null);

    const res = await createLabResultMasterApi({ lab_result_name });

    if (!res.ok) {
      setLabResultError(res.message);
      setLabResultActionLoading(false);
      return false;
    }

    await getAllLabResultMasters();
    setLabResultActionLoading(false);
    return true;
  }, [getAllLabResultMasters]);

  const updateLabResultMaster = useCallback(async (labResultId, lab_result_name) => {
    setLabResultActionLoading(true);
    setLabResultError(null);

    const res = await updateLabResultMasterApi(labResultId, { lab_result_name });

    if (!res.ok) {
      setLabResultError(res.message);
      setLabResultActionLoading(false);
      return false;
    }

    await getAllLabResultMasters();
    setLabResultActionLoading(false);
    return true;
  }, [getAllLabResultMasters]);

  const deleteLabResultMaster = useCallback(async (labResultId) => {
    setLabResultActionLoading(true);
    setLabResultError(null);

    const res = await deleteLabResultMasterApi(labResultId);

    if (!res.ok) {
      setLabResultError(res.message);
      setLabResultActionLoading(false);
      return false;
    }

    await getAllLabResultMasters();
    setLabResultActionLoading(false);
    return true;
  }, [getAllLabResultMasters]);

  const value = useMemo(() => ({
    labResults,
    loadingLabResults,
    labResultActionLoading,
    labResultError,
    getAllLabResultMasters,
    createLabResultMaster,
    updateLabResultMaster,
    deleteLabResultMaster,
  }), [
    labResults,
    loadingLabResults,
    labResultActionLoading,
    labResultError,
    getAllLabResultMasters,
    createLabResultMaster,
    updateLabResultMaster,
    deleteLabResultMaster,
  ]);

  return (
    <LabResultMasterContext.Provider value={value}>
      {children}
    </LabResultMasterContext.Provider>
  );
};
