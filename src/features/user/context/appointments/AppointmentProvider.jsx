import { useState, useCallback, useMemo } from "react";
import { AppointmentContext } from "./AppointmentContext";
import {
  getAllAppointmentsApi,
  rescheduleAppointmentApi,
  cancelAppointmentApi,
  craeteAppointmentApi,
} from "../../api/appointmentApi.js";

export const AppointmentProvider = ({ children }) => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllAppointments = useCallback(async (doctorId, clinicId) => {
    setLoading(true);
    setError(null);

    const res = await getAllAppointmentsApi(doctorId, clinicId);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setAllAppointments(res.data.allAppointments || []);
    setTodayAppointments(res.data.todayAppointments || []);
    setLoading(false);
  }, []);

  const rescheduleAppointment = useCallback(async (
    appointmentId,
    appointmentDate,
    appointmentType,
    doctorId,
    clinicId
  ) => {
    setLoading(true);
    setError(null);

    const res = await rescheduleAppointmentApi(
      appointmentId,
      appointmentDate,
      appointmentType
    );

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    if (doctorId && clinicId) {
      getAllAppointments(Number(doctorId), Number(clinicId));
    }

    setLoading(false);
  }, [getAllAppointments]);

  const cancelAppointment = useCallback(async (appointmentId, reason) => {
    setLoading(true);
    setError(null);

    const res = await cancelAppointmentApi(appointmentId, reason);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }
    setLoading(false);
  }, []);

  const createAppointment = useCallback(async (appointmentData) => {
    setLoading(true);
    setError(null);

    const res = await craeteAppointmentApi(appointmentData);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    await getAllAppointments(
      appointmentData.doctorId,
      appointmentData.clinicId
    );

    setLoading(false);
  }, [getAllAppointments]);

  const clearAppointments = useCallback(() => {
    setAllAppointments([]);
    setTodayAppointments([]);
  }, []);

  const value = useMemo(() => ({
    allAppointments,
    todayAppointments,
    loading,
    error,
    getAllAppointments,
    clearAppointments,
    rescheduleAppointment,
    cancelAppointment,
    createAppointment,
  }), [
    allAppointments,
    todayAppointments,
    loading,
    error,
    getAllAppointments,
    clearAppointments,
    rescheduleAppointment,
    cancelAppointment,
    createAppointment,
  ]);

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};
