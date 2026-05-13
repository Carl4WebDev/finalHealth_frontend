import { apiRequest } from "../../../api/httpClient/httpClient";

// certificate master
export const getAllCertificateMastersApi = () =>
  apiRequest("/api/med-routes/certificate-masters");

export const createCertificateMasterApi = (data) =>
  apiRequest("/api/med-routes/certificate-masters", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCertificateMasterApi = (certificateId, data) =>
  apiRequest(`/api/med-routes/certificate-masters/${certificateId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteCertificateMasterApi = (certificateId) =>
  apiRequest(`/api/med-routes/certificate-masters/${certificateId}`, {
    method: "DELETE",
  });
