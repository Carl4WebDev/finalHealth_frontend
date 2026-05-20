import { apiRequest } from "../../../api/httpClient/httpClient";
import { apiFormRequest } from "../../../api/httpClient/apiFormRequest";

export const getPatientOfDoctorInClinicApi = (doctorId, clinicId) =>
  apiRequest(
    `/api/patient-routes/doctor/${doctorId}/clinic/${clinicId}/patients`,
  );
export const createPatientApi = (patientData) =>
  apiRequest(`/api/patient-routes`, {
    method: "POST",
    body: JSON.stringify(patientData),
  });
export const updatePatientInfoApi = (patientId, patientData) =>
  apiRequest(`/api/patient-routes/${patientId}/patient`, {
    method: "PUT",
    body: JSON.stringify(patientData),
  });

export const uploadPatientImageApi = async (patientId, imageFile) => {
  const formData = new FormData();
  formData.append("patient_image", imageFile);

  return await apiFormRequest(
    `/api/patient-routes/patients/${patientId}/image`,
    {
      method: "PATCH",
      body: formData,
    },
  );
};
