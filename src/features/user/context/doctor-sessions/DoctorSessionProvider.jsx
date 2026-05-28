import { useState, useCallback, useMemo } from "react";
import { DoctorSessionContext } from "./DoctorSessionContext.jsx";
import {
  getDoctorScheduleInClinicApi,
  getAllDoctorSessionsApi,
  createDoctorSessionApi,
  deleteSessionApi,
} from "../../api/doctorSessionApi.js";

export const DoctorSessionProvider = ({ children }) => {
  const [doctorSessions, setDoctorSessions] = useState([]);
  const [allDoctorSessions, setAllDoctorSessions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createDoctorSessionLoading, setCreateDoctorSessionLoading] = useState(false);
  const [deleteSessionLoading, setDeleteSessionLoading] = useState(false);

  const getDoctorScheduleInClinic = useCallback(async (doctorId, clinicId) => {
    setLoading(true);
    setError(null);

    const res = await getDoctorScheduleInClinicApi(doctorId, clinicId);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setDoctorSessions(res.data.sessions || []);
    setLoading(false);
  }, []);

  const getAllDoctorSessions = useCallback(async (doctorId) => {
    setLoading(true);
    setError(null);

    const res = await getAllDoctorSessionsApi(doctorId);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setAllDoctorSessions(res.data.sessions || []);
    setLoading(false);
  }, []);

  const createDoctorSession = useCallback(async (doctorId, clinicId) => {
    setCreateDoctorSessionLoading(true);
    setError(null);

    const res = await createDoctorSessionApi(doctorId, clinicId);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setCreateDoctorSessionLoading(false);
  }, []);

  const deleteSession = useCallback(async (sessionId) => {
    setDeleteSessionLoading(true);
    setError(null);

    const res = await deleteSessionApi(sessionId);

    if (!res.ok) {
      setError(res.message);
      setDeleteSessionLoading(false);
      return;
    }

    setDeleteSessionLoading(false);
  }, []);

  const value = useMemo(() => ({
    doctorSessions,
    allDoctorSessions,
    loading,
    createDoctorSessionLoading,
    error,
    getDoctorScheduleInClinic,
    getAllDoctorSessions,
    createDoctorSession,
    deleteSession,
  }), [
    doctorSessions,
    allDoctorSessions,
    loading,
    createDoctorSessionLoading,
    error,
    getDoctorScheduleInClinic,
    getAllDoctorSessions,
    createDoctorSession,
    deleteSession,
  ]);

  return (
    <DoctorSessionContext.Provider value={value}>
      {children}
    </DoctorSessionContext.Provider>
  );
};
