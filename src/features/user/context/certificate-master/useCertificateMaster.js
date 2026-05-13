import { useContext } from "react";

import { CertificateMasterContext } from "./CertificateMasterContext.jsx";

export const useCertificateMaster = () => {
  const ctx = useContext(CertificateMasterContext);

  if (!ctx) {
    throw new Error(
      "useCertificateMaster must be used inside CertificateMasterProvider",
    );
  }

  return ctx;
};
