import { useContext } from "react";
import { DiagnosisTreatmentContext } from "./DiagnosisTreatmentContext";

export const useDiagnosisTreatment = () => {
  const ctx = useContext(DiagnosisTreatmentContext);

  if (!ctx) {
    throw new Error(
      "useDiagnosisTreatment must be used inside DiagnosisTreatmentProvider",
    );
  }

  return ctx;
};
