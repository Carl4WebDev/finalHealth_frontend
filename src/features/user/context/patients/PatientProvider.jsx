import { useState, useCallback, useMemo } from "react";
import { PatientContext } from "./PatientContext.jsx";
import {
  getPatientOfDoctorInClinicApi,
  createPatientApi,
  updatePatientInfoApi,
  uploadPatientImageApi,
} from "../../api/patientApi.js";

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearPatients = useCallback(() => {
    setPatients([]);
  }, []);

  const getPatientOfDoctorInClinic = useCallback(async (doctorId, clinicId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getPatientOfDoctorInClinicApi(doctorId, clinicId);

      if (!res.ok) {
        setError(res.message);
        setPatients([]);
        return;
      }

      setPatients(res.data.patients || []);
    } catch (err) {
      setError("Something went wrong");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPatient = useCallback(async (patientData) => {
    setLoading(true);
    setError(null);

    const res = await createPatientApi(patientData);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return false;
    }

    await getPatientOfDoctorInClinic(
      patientData.doctorId,
      patientData.clinicId
    );

    setLoading(false);
    return true;
  }, [getPatientOfDoctorInClinic]);

  const updatePatientInfo = useCallback(async (patientId, patientData) => {
    setLoading(true);
    setError(null);

    const res = await updatePatientInfoApi(patientId, patientData);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return false;
    }

    setLoading(false);
    return true;
  }, []);

  const uploadPatientImage = useCallback(async (patientId, imageFile) => {
    setUploadImageLoading(true);
    setError(null);

    const res = await uploadPatientImageApi(patientId, imageFile);

    if (!res.ok) {
      setError(res.message);
      setUploadImageLoading(false);
      return false;
    }

    const updatedPatient = res.data.patient;

    setPatients((prev) =>
      prev.map((p) =>
        Number(p.patient_id) === Number(updatedPatient.patient_id)
          ? {
              ...p,
              patient_img_path: updatedPatient.patient_img_path,
            }
          : p
      )
    );

    setUploadImageLoading(false);
    return true;
  }, []);

  const value = useMemo(() => ({
    patients,
    loading,
    uploadImageLoading,
    error,
    clearPatients,
    getPatientOfDoctorInClinic,
    createPatient,
    updatePatientInfo,
    uploadPatientImage,
  }), [
    patients,
    loading,
    uploadImageLoading,
    error,
    clearPatients,
    getPatientOfDoctorInClinic,
    createPatient,
    updatePatientInfo,
    uploadPatientImage,
  ]);

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};
