import { useContext } from "react";
import { PrescriptionMasterContext } from "./PrescriptionMasterContext.jsx";

export const usePrescriptionMaster = () => {
  const ctx = useContext(PrescriptionMasterContext);

  if (!ctx) {
    throw new Error(
      "usePrescriptionMaster must be used inside PrescriptionMasterProvider",
    );
  }

  return ctx;
};
