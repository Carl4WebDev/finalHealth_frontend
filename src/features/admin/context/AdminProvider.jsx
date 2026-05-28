import { useState, useCallback, useMemo } from "react";
import { AdminContext } from "./AdminContext.jsx";
import { getAllSubscribersApi, getCustomerRevenueApi, getDashboardSummaryApi } from "../api/adminApi.js";

export const AdminProvider = ({ children }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllSubscribers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getAllSubscribersApi();
    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }
    setSubscribers(res.data.subscribers || []);
    setLoading(false);
  }, []);

  const clearSubscribers = useCallback(() => {
    setSubscribers([]);
  }, []);

  const getRevenue = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await getCustomerRevenueApi();

    if (!res.ok) {
      setError(res.message || "Failed to load revenue");
      setLoading(false);
      return;
    }

    setRevenue(res.data || []);
    setLoading(false);
  }, []);

  const getDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await getDashboardSummaryApi();

    if (!res.ok) {
      setError(res.message || "Failed to load dashboard stats");
      setLoading(false);
      return;
    }

    setDashboard(res.data || null);
    setLoading(false);
  }, []);

  const value = useMemo(() => ({
    subscribers,
    revenue,
    dashboard,
    loading,
    error,
    getAllSubscribers,
    getRevenue,
    getDashboardData,
    clearSubscribers,
  }), [
    subscribers,
    revenue,
    dashboard,
    loading,
    error,
    getAllSubscribers,
    getRevenue,
    getDashboardData,
    clearSubscribers,
  ]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
