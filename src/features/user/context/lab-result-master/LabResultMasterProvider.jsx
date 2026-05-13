import { useState } from "react";

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

  const [labResultActionLoading, setLabResultActionLoading] =
    useState(false);

  const [labResultError, setLabResultError] = useState(null);

  const getAllLabResultMasters = async () => {
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
  };

  const createLabResultMaster = async (lab_result_name) => {
    setLabResultActionLoading(true);
    setLabResultError(null);

    const res = await createLabResultMasterApi({
      lab_result_name,
    });

    if (!res.ok) {
      setLabResultError(res.message);
      setLabResultActionLoading(false);
      return false;
    }

    await getAllLabResultMasters();

    setLabResultActionLoading(false);

    return true;
  };

  const updateLabResultMaster = async (
    labResultId,
    lab_result_name,
  ) => {
    setLabResultActionLoading(true);
    setLabResultError(null);

    const res = await updateLabResultMasterApi(labResultId, {
      lab_result_name,
    });

    if (!res.ok) {
      setLabResultError(res.message);
      setLabResultActionLoading(false);
      return false;
    }

    await getAllLabResultMasters();

    setLabResultActionLoading(false);

    return true;
  };

  const deleteLabResultMaster = async (labResultId) => {
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
  };

  return (
    <LabResultMasterContext.Provider
      value={{
        labResults,

        loadingLabResults,
        labResultActionLoading,

        labResultError,

        getAllLabResultMasters,
        createLabResultMaster,
        updateLabResultMaster,
        deleteLabResultMaster,
      }}
    >
      {children}
    </LabResultMasterContext.Provider>
  );
};