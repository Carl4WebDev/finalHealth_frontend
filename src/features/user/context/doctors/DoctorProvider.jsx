import { useState, useCallback, useMemo } from "react";
import { DoctorContext } from "./DoctorContext.jsx";
import {
  getAllApprovedDoctorsOfUserApi,
  getAllDoctorsOfUserApi,
  createDoctorApi,
  updateDoctorInfoApi,
  getDoctorsByClinicApi
} from "../../api/doctorApi.js";

export const DoctorProvider = ({ children }) => {
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [clinicDoctors, setClinicDoctors] = useState([]);
  const [loadingClinicDoctors, setLoadingClinicDoctors] = useState(false);

  const getDoctorsByClinic = useCallback(async (clinicId) => {
    setLoadingClinicDoctors(true);
    setError(null);

    const res = await getDoctorsByClinicApi(clinicId);

    if (!res.ok) {
      setError(res.message);
      setLoadingClinicDoctors(false);
      return;
    }

    setClinicDoctors(res.data.doctors || []);
    setLoadingClinicDoctors(false);
  }, []);

  const getAllApprovedDoctorsOfUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await getAllApprovedDoctorsOfUserApi();

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return res;
    }

    setApprovedDoctors(res.data || []);
    setLoading(false);
    return res;
  }, []);

  const getAllDoctorsOfUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await getAllDoctorsOfUserApi();

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return res;
    }

    setDoctors(res.data || []);
    setLoading(false);
    return res;
  }, []);

  const createDoctor = useCallback(async (doctorData) => {
    setLoading(true);
    setError(null);

    const res = await createDoctorApi(doctorData);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return res;
    }

    await getAllDoctorsOfUser();

    setLoading(false);
    return res;
  }, [getAllDoctorsOfUser]);

  const updateDoctorInfo = useCallback(async (doctorId, doctorData) => {
    setLoading(true);
    setError(null);

    const res = await updateDoctorInfoApi(doctorId, doctorData);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return res;
    }

    await getAllDoctorsOfUser();

    setLoading(false);
    return res;
  }, [getAllDoctorsOfUser]);

  const value = useMemo(() => ({
    approvedDoctors,
    clinicDoctors,
    loadingClinicDoctors,
    doctors,
    loading,
    error,
    getAllApprovedDoctorsOfUser,
    getAllDoctorsOfUser,
    createDoctor,
    updateDoctorInfo,
    getDoctorsByClinic,
  }), [
    approvedDoctors,
    clinicDoctors,
    loadingClinicDoctors,
    doctors,
    loading,
    error,
    getAllApprovedDoctorsOfUser,
    getAllDoctorsOfUser,
    createDoctor,
    updateDoctorInfo,
    getDoctorsByClinic,
  ]);

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};
