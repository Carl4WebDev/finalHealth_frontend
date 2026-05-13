import { apiRequest } from "../../../api/httpClient/httpClient";

// lab result master
export const getAllLabResultMastersApi = () =>
  apiRequest("/api/med-routes/lab-result-masters");

export const createLabResultMasterApi = (data) =>
  apiRequest("/api/med-routes/lab-result-masters", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateLabResultMasterApi = (labResultId, data) =>
  apiRequest(`/api/med-routes/lab-result-masters/${labResultId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteLabResultMasterApi = (labResultId) =>
  apiRequest(`/api/med-routes/lab-result-masters/${labResultId}`, {
    method: "DELETE",
  });
