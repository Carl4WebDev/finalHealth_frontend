import { apiRequest } from "../../../api/httpClient/httpClient";

export const getAllClinicsOfDoctorApi = (doctorId) =>
  apiRequest(`/api/clinic-routes/doctor/${doctorId}/clinics`);

export const getAllClinicsOfUserNotAffiliatedApi = (doctorId) =>
  apiRequest(`/api/clinic-routes/doctor/${doctorId}/not-affiliated-clinics`);

export const getClinicSessionsApi = (clinicId) =>
  apiRequest(`/api/clinic-routes/clinic/${clinicId}/sessions`);

export const getAllClinicsOfUserApi = () =>
  apiRequest(`/api/clinic-routes/all-clinics`);
export const getClinicInfoApi = (clinicId) =>
  apiRequest(`/api/clinic-routes/clinic/${clinicId}/clinic-info`);

export const deleteClinicSessionApi = (sessionClinicId) =>
  apiRequest(`/api/clinic-routes/session/${sessionClinicId}/delete-session`, {
    method: "DELETE",
  });

export const createAffiliationDoctorToClinicApi = (doctorId, clinicId, affiliationCode) =>
  apiRequest(
    `/api/clinic-routes/doctor/${doctorId}/clinic/${clinicId}/affiliate-clinic`,
    {
      method: "POST",
      body: JSON.stringify({ affiliation_code: affiliationCode }),
    }
  );

export const createClinicApi = (clinicData) =>
  apiRequest(`/api/clinic-routes`, {
    method: "POST",
    body: JSON.stringify(clinicData),
  });

export const createClinicSessionApi = (clinicId, clinicSessionData) =>
  apiRequest(`/api/clinic-routes/clinic/${clinicId}/create-clinic-session`, {
    method: "POST",
    body: JSON.stringify(clinicSessionData),
  });

export const deleteClinicAffiliationApi = (doctorId, clinicId) =>
  apiRequest(
    `/api/clinic-routes/doctor/${doctorId}/clinic/${clinicId}/unaffiliate-clinic`,
    {
      method: "DELETE",
    }
  );

export const updateClinicApi = (clinicId, clinicData) =>
  apiRequest(`/api/clinic-routes/clinic/${clinicId}/update-clinic`, {
    method: "PUT",
    body: JSON.stringify(clinicData),
  });
