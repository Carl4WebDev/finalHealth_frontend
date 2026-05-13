import { useContext } from "react";

import { FeeMasterContext } from "./FeeMasterContext.jsx";

export const useFeeMaster = () => {
  const ctx = useContext(FeeMasterContext);

  if (!ctx) {
    throw new Error("useFeeMaster must be used inside FeeMasterProvider");
  }

  return ctx;
};
