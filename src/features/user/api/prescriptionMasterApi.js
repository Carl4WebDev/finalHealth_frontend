import { apiRequest } from "../../../api/httpClient/httpClient";

// prescription master
export const getAllPrescriptionMastersApi = () =>
  apiRequest("/api/med-routes/prescription-masters");

export const getPrescriptionMasterByIdApi = (prescriptionId) =>
  apiRequest(`/api/med-routes/prescription-masters/${prescriptionId}`);

export const createPrescriptionMasterApi = (data) =>
  apiRequest("/api/med-routes/prescription-masters", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updatePrescriptionMasterApi = (prescriptionId, data) =>
  apiRequest(`/api/med-routes/prescription-masters/${prescriptionId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deletePrescriptionMasterApi = (prescriptionId) =>
  apiRequest(`/api/med-routes/prescription-masters/${prescriptionId}`, {
    method: "DELETE",
  });
