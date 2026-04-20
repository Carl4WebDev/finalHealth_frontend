import { apiRequest } from "../../../api/httpClient/httpClient";

// Diagnosis
export const getAllDiagnosesApi = () => apiRequest("/api/med-routes/diagnoses");

export const createDiagnosisApi = (data) =>
  apiRequest("/api/med-routes/diagnoses", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateDiagnosisApi = (diagnosisId, data) =>
  apiRequest(`/api/med-routes/diagnoses/${diagnosisId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteDiagnosisApi = (diagnosisId) =>
  apiRequest(`/api/med-routes/diagnoses/${diagnosisId}`, {
    method: "DELETE",
  });

// Treatment
export const getAllTreatmentsApi = () =>
  apiRequest("/api/med-routes/treatments");

export const createTreatmentApi = (data) =>
  apiRequest("/api/med-routes/treatments", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTreatmentApi = (treatmentId, data) =>
  apiRequest(`/api/med-routes/treatments/${treatmentId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteTreatmentApi = (treatmentId) =>
  apiRequest(`/api/med-routes/treatments/${treatmentId}`, {
    method: "DELETE",
  });
