import { useState } from "react";
import { DoctorContext } from "./DoctorContext.jsx";
import {
  getAllApprovedDoctorsOfUserApi,
  getAllDoctorsOfUserApi,
  createDoctorApi,
  updateDoctorInfoApi,
} from "../../api/doctorApi.js";

export const DoctorProvider = ({ children }) => {
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllApprovedDoctorsOfUser = async () => {
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
  };

  const getAllDoctorsOfUser = async () => {
    setLoading(true);
    setError(null);

    const res = await getAllDoctorsOfUserApi();

    console.log(!res.ok);
    if (!res.ok) {
      console.log("inside the error");
      setError(res.message);
      setLoading(false);
      return res;
    }

    setDoctors(res.data || []);
    setLoading(false);
    return res;
  };

  const createDoctor = async (doctorData) => {
    setLoading(true);
    setError(null);

    const res = await createDoctorApi(doctorData);

    console.log(!res.ok);
    if (!res.ok) {
      console.log("inside the error");
      setError(res.message);
      setLoading(false);
      return res;
    }

    await getAllDoctorsOfUser();

    setLoading(false);
    return res;
  };

  const updateDoctorInfo = async (doctorId, doctorData) => {
    setLoading(true);
    setError(null);

    const res = await updateDoctorInfoApi(doctorId, doctorData);

    console.log(!res.ok);
    if (!res.ok) {
      console.log("inside the error");
      setError(res.message);
      setLoading(false);
      return res;
    }

    await getAllDoctorsOfUser();

    setLoading(false);
    return res;
  };

  return (
    <DoctorContext.Provider
      value={{
        approvedDoctors,
        doctors,
        loading,
        error,
        getAllApprovedDoctorsOfUser,
        getAllDoctorsOfUser,
        createDoctor,
        updateDoctorInfo,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};