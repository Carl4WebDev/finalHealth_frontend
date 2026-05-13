import { useContext } from "react";

import { LabResultMasterContext } from "./LabResultMasterContext.jsx";

export const useLabResultMaster = () => {
  const ctx = useContext(LabResultMasterContext);

  if (!ctx) {
    throw new Error(
      "useLabResultMaster must be used inside LabResultMasterProvider",
    );
  }

  return ctx;
};
