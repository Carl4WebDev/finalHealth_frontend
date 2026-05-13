import { useState } from "react";
import { PrescriptionMasterContext } from "./PrescriptionMasterContext.jsx";

import {
  getAllPrescriptionMastersApi,
  createPrescriptionMasterApi,
  updatePrescriptionMasterApi,
  deletePrescriptionMasterApi,
} from "../../api/prescriptionMasterApi.js";

export const PrescriptionMasterProvider = ({ children }) => {
  const [prescriptions, setPrescriptions] = useState([]);

  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

  const [prescriptionActionLoading, setPrescriptionActionLoading] =
    useState(false);

  const [prescriptionError, setPrescriptionError] = useState(null);

  const getAllPrescriptionMasters = async () => {
    setLoadingPrescriptions(true);
    setPrescriptionError(null);

    const res = await getAllPrescriptionMastersApi();

    if (!res.ok) {
      setPrescriptionError(res.message);
      setLoadingPrescriptions(false);
      return;
    }

    setPrescriptions(res.data.prescriptions || []);
    setLoadingPrescriptions(false);
  };

  const createPrescriptionMaster = async (prescription_name) => {
    setPrescriptionActionLoading(true);
    setPrescriptionError(null);

    const res = await createPrescriptionMasterApi({
      prescription_name,
    });

    if (!res.ok) {
      setPrescriptionError(res.message);
      setPrescriptionActionLoading(false);
      return false;
    }

    await getAllPrescriptionMasters();

    setPrescriptionActionLoading(false);

    return true;
  };

  const updatePrescriptionMaster = async (
    prescriptionId,
    prescription_name,
  ) => {
    setPrescriptionActionLoading(true);
    setPrescriptionError(null);

    const res = await updatePrescriptionMasterApi(prescriptionId, {
      prescription_name,
    });

    if (!res.ok) {
      setPrescriptionError(res.message);
      setPrescriptionActionLoading(false);
      return false;
    }

    await getAllPrescriptionMasters();

    setPrescriptionActionLoading(false);

    return true;
  };

  const deletePrescriptionMaster = async (prescriptionId) => {
    setPrescriptionActionLoading(true);
    setPrescriptionError(null);

    const res = await deletePrescriptionMasterApi(prescriptionId);

    if (!res.ok) {
      setPrescriptionError(res.message);
      setPrescriptionActionLoading(false);
      return false;
    }

    await getAllPrescriptionMasters();

    setPrescriptionActionLoading(false);

    return true;
  };

  return (
    <PrescriptionMasterContext.Provider
      value={{
        prescriptions,

        loadingPrescriptions,
        prescriptionActionLoading,

        prescriptionError,

        getAllPrescriptionMasters,
        createPrescriptionMaster,
        updatePrescriptionMaster,
        deletePrescriptionMaster,
      }}
    >
      {children}
    </PrescriptionMasterContext.Provider>
  );
};