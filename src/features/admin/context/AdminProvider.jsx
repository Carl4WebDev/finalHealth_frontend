import { useState } from "react";
import { AdminContext } from "./AdminContext.jsx";
// 1. ADD getCustomerRevenueApi to your imports
import { getAllSubscribersApi, getCustomerRevenueApi } from "../api/adminApi.js"; 

export const AdminProvider = ({ children }) => {
  const [subscribers, setSubscribers] = useState([]);
  // 2. ADD the revenue state variable here
  const [revenue, setRevenue] = useState([]); 
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

  

  return (
    <AdminContext.Provider
      value={{
        subscribers,
        revenue,          // 3. ADD THIS
        loading,
        error,
        getAllSubscribers,
        getRevenue,       // 3. ADD THIS
        clearSubscribers,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};