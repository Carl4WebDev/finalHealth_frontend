import { apiRequest } from "../../../api/httpClient/httpClient";
import { apiFormRequest } from "../../../api/httpClient/apiFormRequest";

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

// visit history
export const getPatientVisitHistoryApi = (patientId) =>
  apiRequest(`/api/med-routes/patient/${patientId}/visit-history`);

// medical record
export const updateMedicalRecordApi = (recordId, medicalRecordData) =>
  apiRequest(`/api/med-routes/medical-records/${recordId}`, {
    method: "PATCH",
    body: JSON.stringify(medicalRecordData),
  });

export const deleteMedicalRecordApi = (recordId) =>
  apiRequest(`/api/med-routes/medical-records/${recordId}`, {
    method: "DELETE",
  });

// prescription
export const getPrescriptionsByRecordApi = (recordId) =>
  apiRequest(`/api/med-routes/record/${recordId}/prescriptions`);

export const getPrescriptionByIdApi = (prescriptionId) =>
  apiRequest(`/api/med-routes/prescriptions/${prescriptionId}`);

export const createPrescriptionApi = (recordId, prescriptionData) =>
  apiRequest(`/api/med-routes/record/${recordId}/prescriptions`, {
    method: "POST",
    body: JSON.stringify(prescriptionData),
  });

export const updatePrescriptionApi = (prescriptionId, prescriptionData) =>
  apiRequest(`/api/med-routes/prescriptions/${prescriptionId}`, {
    method: "PATCH",
    body: JSON.stringify(prescriptionData),
  });

export const deletePrescriptionApi = (prescriptionId) =>
  apiRequest(`/api/med-routes/prescriptions/${prescriptionId}`, {
    method: "DELETE",
  });

// lab results
export const getLabResultsByRecordApi = (recordId) =>
  apiRequest(`/api/med-routes/record/${recordId}/lab-results`);

export const getLabResultByIdApi = (resultId) =>
  apiRequest(`/api/med-routes/lab-results/${resultId}`);

export const createLabResultApi = (recordId, formData) =>
  apiFormRequest(`/api/med-routes/record/${recordId}/lab-results`, {
    method: "POST",
    body: formData,
  });

export const updateLabResultImageApi = (labResultId, formData) =>
  apiFormRequest(`/api/med-routes/lab-results/${labResultId}/image`, {
    method: "PATCH",
    body: formData,
  });

export const updateLabResultApi = (resultId, labResultData) =>
  apiRequest(`/api/med-routes/lab-results/${resultId}`, {
    method: "PATCH",
    body: JSON.stringify(labResultData),
  });

export const deleteLabResultApi = (resultId) =>
  apiRequest(`/api/med-routes/lab-results/${resultId}`, {
    method: "DELETE",
  });

// certificates
export const getCertificatesByRecordApi = (recordId) =>
  apiRequest(`/api/med-routes/record/${recordId}/certificates`);

export const getCertificateByIdApi = (certificateId) =>
  apiRequest(`/api/med-routes/certificates/${certificateId}`);

export const createCertificateApi = (recordId, data) =>
  apiRequest(`/api/med-routes/record/${recordId}/certificates`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCertificateImageApi = (certificateId, formData) =>
  apiFormRequest(`/api/med-routes/certificates/${certificateId}/image`, {
    method: "PATCH",
    body: formData,
  });

export const updateCertificateApi = (certificateId, certificateData) =>
  apiRequest(`/api/med-routes/certificates/${certificateId}`, {
    method: "PATCH",
    body: JSON.stringify(certificateData),
  });

export const deleteCertificateApi = (certificateId) =>
  apiRequest(`/api/med-routes/certificates/${certificateId}`, {
    method: "DELETE",
  });

export const getMedicalRecordByAppointmentIdApi = (appointmentId) =>
  apiRequest(`/api/med-routes/appointment/${appointmentId}/medical-record`);

export const getDoctorLimitStatusApi = () =>
  apiRequest("/api/med-routes/limit-status");

export const getClinicLimitStatusApi = () =>
  apiRequest("/api/med-routes/limit-status/clinic");
