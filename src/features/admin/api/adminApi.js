import { apiRequest } from "../../../api/httpClient/httpClient";

export const loginAdmin = (email, password) =>
  apiRequest("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerAdmin = (payload) =>
  apiRequest("/api/admin/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const getDashboardSummaryApi = () => apiRequest("/api/admin/dashboard-summary");
export const getAllSubscribersApi = () => apiRequest("/api/admin/subscribers");
export const getCustomerRevenueApi = () => apiRequest("/api/admin/revenue");