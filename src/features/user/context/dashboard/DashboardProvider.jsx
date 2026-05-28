import { useState, useCallback, useMemo } from "react";
import { DashboardContext } from "./DashboardContext";
import { getDashboardOverviewApi, getDashboardUsageApi } from "../../api/dashboardApi.js";

export const DashboardProvider = ({ children }) => {
  const [summaryCards, setSummaryCards] = useState({
    clinics: 0,
    doctors: 0,
    appointments: 0,
  });

  const [usage, setUsage] = useState({
    activeUsers: { used: 0, total: 0 },
    patients: { used: 0, total: null },
    monthsRemaining: { used: 0, total: 0 },
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [networkClinics, setNetworkClinics] = useState([]);
  const [networkDoctors, setNetworkDoctors] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDashboardOverview = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getDashboardOverviewApi();

      if (!res.ok) {
        setError(res.message || "Failed to fetch dashboard overview");
        return;
      }

      const overview = res.data?.overview || {};

      setSummaryCards(
        overview.summaryCards || {
          clinics: 0,
          doctors: 0,
          appointments: 0,
        }
      );
      setAnalytics(overview.analytics || null);
      setUpcomingAppointments(overview.upcomingAppointments || []);
      setSubscription(overview.subscription || null);
      setNetworkClinics(overview.network?.clinics || []);
      setNetworkDoctors(overview.network?.doctors || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const getDashboardUsage = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getDashboardUsageApi();

      if (!res.ok) {
        setError(res.message || "Failed to fetch dashboard usage");
        return;
      }

      const usageData = res.data?.usage || {};

      setUsage({
        activeUsers: usageData.activeUsers || { used: 0, total: 0 },
        patients: usageData.patients || { used: 0, total: null },
        monthsRemaining:
          usageData.monthsRemaining || { used: 0, total: 0 },
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearDashboard = useCallback(() => {
    setSummaryCards({
      clinics: 0,
      doctors: 0,
      appointments: 0,
    });
    setAnalytics(null);
    setUpcomingAppointments([]);
    setSubscription(null);
    setNetworkClinics([]);
    setNetworkDoctors([]);
    setError(null);
  }, []);

  const value = useMemo(() => ({
    summaryCards,
    analytics,
    upcomingAppointments,
    subscription,
    networkClinics,
    networkDoctors,
    loading,
    error,
    usage,
    getDashboardUsage,
    getDashboardOverview,
    clearDashboard,
  }), [
    summaryCards,
    analytics,
    upcomingAppointments,
    subscription,
    networkClinics,
    networkDoctors,
    loading,
    error,
    usage,
    getDashboardUsage,
    getDashboardOverview,
    clearDashboard,
  ]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
