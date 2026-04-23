import { useState } from "react";
import { AdminContext } from "./AdminContext.jsx";
// 1. ADD getCustomerRevenueApi to your imports
import { getAllSubscribersApi, getCustomerRevenueApi, getDashboardSummaryApi} from "../api/adminApi.js"; 

export const AdminProvider = ({ children }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [revenue, setRevenue] = useState([]); 
  const [dashboard, setDashboard] = useState(null); // For dashboard summary
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllSubscribers = async () => {
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
  };

  const clearSubscribers = () => {
    setSubscribers([]);
  };

  // Your Revenue function
  const getRevenue = async () => {
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
  };

  const getDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    const res = await getDashboardSummaryApi();
    
    if (!res.ok) {
      setError(res.message || "Failed to load dashboard stats");
      setLoading(false);
      return;
    }
    
    // This saves the counts (users, doctors, etc.) into state
    setDashboard(res.data || null);
    setLoading(false);
  };

  return (
    <AdminContext.Provider
      value={{
        subscribers,
        revenue,          
        dashboard,        
        loading,
        error,
        getAllSubscribers,
        getRevenue,       
        getDashboardData,
        clearSubscribers,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};