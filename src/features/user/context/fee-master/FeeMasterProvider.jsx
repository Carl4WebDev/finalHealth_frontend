import { useState, useCallback, useMemo } from "react";
import { FeeMasterContext } from "./FeeMasterContext.jsx";

import {
  getAllFeesApi,
  createFeeApi,
  updateFeeApi,
  deleteFeeApi,
} from "../../api/feeMasterApi.js";

export const FeeMasterProvider = ({ children }) => {
  const [fees, setFees] = useState([]);
  const [loadingFees, setLoadingFees] = useState(false);
  const [feeActionLoading, setFeeActionLoading] = useState(false);
  const [feeError, setFeeError] = useState(null);

  const getAllFees = useCallback(async () => {
    setLoadingFees(true);
    setFeeError(null);

    const res = await getAllFeesApi();

    if (!res.ok) {
      setFeeError(res.message);
      setLoadingFees(false);
      return;
    }

    setFees(res.data.fees || []);
    setLoadingFees(false);
  }, []);

  const createFee = useCallback(async ({ fee_name, amount }) => {
    setFeeActionLoading(true);
    setFeeError(null);

    const res = await createFeeApi({ fee_name, amount });

    if (!res.ok) {
      setFeeError(res.message);
      setFeeActionLoading(false);
      return false;
    }

    await getAllFees();
    setFeeActionLoading(false);
    return true;
  }, [getAllFees]);

  const updateFee = useCallback(async (feeId, { fee_name, amount }) => {
    setFeeActionLoading(true);
    setFeeError(null);

    const res = await updateFeeApi(feeId, { fee_name, amount });

    if (!res.ok) {
      setFeeError(res.message);
      setFeeActionLoading(false);
      return false;
    }

    await getAllFees();
    setFeeActionLoading(false);
    return true;
  }, [getAllFees]);

  const deleteFee = useCallback(async (feeId) => {
    setFeeActionLoading(true);
    setFeeError(null);

    const res = await deleteFeeApi(feeId);

    if (!res.ok) {
      setFeeError(res.message);
      setFeeActionLoading(false);
      return false;
    }

    await getAllFees();
    setFeeActionLoading(false);
    return true;
  }, [getAllFees]);

  const value = useMemo(() => ({
    fees,
    loadingFees,
    feeActionLoading,
    feeError,
    getAllFees,
    createFee,
    updateFee,
    deleteFee,
  }), [
    fees,
    loadingFees,
    feeActionLoading,
    feeError,
    getAllFees,
    createFee,
    updateFee,
    deleteFee,
  ]);

  return (
    <FeeMasterContext.Provider value={value}>
      {children}
    </FeeMasterContext.Provider>
  );
};
