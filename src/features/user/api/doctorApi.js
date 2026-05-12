import { apiRequest } from "../../../api/httpClient/httpClient";

export const getAllApprovedDoctorsOfUserApi = () =>
  apiRequest(`/api/doctor-routes/`);

export const getAllDoctorsOfUserApi = () =>
  apiRequest(`/api/doctor-routes/doctors`);

export const createDoctorApi = (doctorData) =>
  apiRequest(`/api/doctor-routes/`, {
    method: "POST",
    body: JSON.stringify(doctorData),
  });

export const updateDoctorInfoApi = (doctorId, doctorData) =>
  apiRequest(`/api/doctor-routes/doctor/${doctorId}/information`, {
    method: "PUT",
    body: JSON.stringify(doctorData),
  });

export const getDoctorsByClinicApi = (clinicId) =>
  apiRequest(`/api/doctor-routes/clinic/${clinicId}/doctors`);
