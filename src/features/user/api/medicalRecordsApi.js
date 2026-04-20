import { apiRequest } from "../../../api/httpClient/httpClient";

export const getPatientOfDoctorInClinicApi = (doctorId, clinicId) =>
  apiRequest(`/api/med-routes/doctor/${doctorId}/clinic/${clinicId}/patients`);

export const getPatientInfoApi = (patientId) =>
  apiRequest(`/api/med-routes/patient/${patientId}/patient-info`);

export const getPatientMedRecordApi = (patientId) =>
  apiRequest(`/api/med-routes/patient/${patientId}/patient-med-rec`);

export const getMedicalRecordsFullDetailsAPi = (recordId) =>
  apiRequest(`/api/med-routes/record/${recordId}/patient-med-rec-detail`);

export const createMedicalRecordApi = (patientId, medicalRecordData) =>
  apiRequest(`/api/med-routes/patient/${patientId}/medical-records`, {
    method: "POST",
    body: JSON.stringify(medicalRecordData),
  });

// vital signs
export const getPatientVitalSignsApi = (patientId) =>
  apiRequest(`/api/med-routes/patient/${patientId}/vitals`);

export const createVitalSignApi = (patientId, vitalSignData) =>
  apiRequest(`/api/med-routes/patient/${patientId}/vitals`, {
    method: "POST",
    body: JSON.stringify(vitalSignData),
  });

// medical record documents
export const uploadMedicalRecordDocumentApi = (recordId, file) => {
  const formData = new FormData();
  formData.append("image", file);

  return apiRequest(
    `/api/medical-record-document-routes/record/${recordId}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );
};
