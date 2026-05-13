import { apiRequest } from "../../../api/httpClient/httpClient";

// fee master
export const getAllFeesApi = () => apiRequest("/api/med-routes/fees");

export const createFeeApi = (data) =>
  apiRequest("/api/med-routes/fees", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateFeeApi = (feeId, data) =>
  apiRequest(`/api/med-routes/fees/${feeId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteFeeApi = (feeId) =>
  apiRequest(`/api/med-routes/fees/${feeId}`, {
    method: "DELETE",
  });
