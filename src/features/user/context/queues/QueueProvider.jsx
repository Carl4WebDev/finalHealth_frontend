import { useState, useCallback, useMemo } from "react";
import { QueueContext } from "./QueueContext.jsx";
import {
  getQueueOfDoctorInClinicApi,
  updateQueueStatusApi,
  addQueueApi,
} from "../../api/queueApi.js";

export const QueueProvider = ({ children }) => {
  const [normalQueues, setNormalQueues] = useState([]);
  const [priorityQueues, setPriorityQueues] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeDoctorId, setActiveDoctorId] = useState(null);
  const [activeClinicId, setActiveClinicId] = useState(null);

  const [addQueueLoading, setAddQueueLoading] = useState(null);
  const [addQueueError, setAddQueueError] = useState(null);

  const getQueueOfDoctorInClinic = useCallback(async (doctorId, clinicId) => {
    if (!doctorId || !clinicId) {
      setNormalQueues([]);
      setPriorityQueues([]);
      setActiveDoctorId(null);
      setActiveClinicId(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    setActiveDoctorId(doctorId);
    setActiveClinicId(clinicId);

    const res = await getQueueOfDoctorInClinicApi(doctorId, clinicId);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setNormalQueues(res.data.normalQueue || []);
    setPriorityQueues(res.data.priorityQueue || []);
    setLoading(false);
  }, []);

  const updateQueueStatus = useCallback(async (queueEntryId, status) => {
    if (!activeDoctorId || !activeClinicId) return false;

    setLoading(true);
    setError(null);

    const res = await updateQueueStatusApi(queueEntryId, status);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }
    await getQueueOfDoctorInClinic(activeDoctorId, activeClinicId);

    setLoading(false);
    return true;
  }, [activeDoctorId, activeClinicId, getQueueOfDoctorInClinic]);

  const addQueue = useCallback(async (queueData) => {
    setAddQueueLoading(true);
    setAddQueueError(null);

    const res = await addQueueApi(queueData);

    if (!res.ok) {
      setAddQueueError(res.message);
      setAddQueueLoading(false);
      return;
    }
    await getQueueOfDoctorInClinic(activeDoctorId, activeClinicId);

    setAddQueueLoading(false);
    return true;
  }, [activeDoctorId, activeClinicId, getQueueOfDoctorInClinic]);

  const clearQueues = useCallback(() => {
    setNormalQueues([]);
    setPriorityQueues([]);
    setActiveDoctorId(null);
    setActiveClinicId(null);
    setError(null);
  }, []);

  const value = useMemo(() => ({
    normalQueues,
    priorityQueues,
    loading,
    error,
    addQueueError,
    addQueueLoading,
    getQueueOfDoctorInClinic,
    updateQueueStatus,
    addQueue,
    clearQueues,
  }), [
    normalQueues,
    priorityQueues,
    loading,
    error,
    addQueueError,
    addQueueLoading,
    getQueueOfDoctorInClinic,
    updateQueueStatus,
    addQueue,
    clearQueues,
  ]);

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};
