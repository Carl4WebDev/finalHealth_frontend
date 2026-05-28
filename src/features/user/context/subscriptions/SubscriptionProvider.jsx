import { useState, useCallback, useMemo } from "react";
import { SubscriptionContext } from "./SubscriptionContext";

import {
  getSubscriptionPlansApi,
  getMySubscriptionApi,
  cancelMySubscriptionApi,
  createPaymentIntentApi,
  getSubscriptionHistoryApi,
  getPaymentHistoryApi,
  activateSubscriptionApi,
} from "../../api/subscriptionApi.js";

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [plan, setPlan] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activateSubscription = useCallback(async (payload) => {
    setLoading(true);
    setError(null);

    const res = await activateSubscriptionApi(payload);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return null;
    }

    setSubscription(res.data.subscription || null);
    setPlan(res.data.plan || null);

    setLoading(false);
    return res.data;
  }, []);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await getSubscriptionPlansApi();

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setPlans(res.data.plans || []);
    setLoading(false);
  }, []);

  const loadMySubscription = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await getMySubscriptionApi();

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setSubscription(res.data.subscription || null);
    setPlan(res.data.plan || null);
    setLoading(false);
  }, []);

  const createPaymentIntent = useCallback(async (planId) => {
    setLoading(true);
    setError(null);

    const res = await createPaymentIntentApi(planId);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return null;
    }

    setLoading(false);
    return res.data.clientSecret;
  }, []);

  const cancelSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await cancelMySubscriptionApi();

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    await loadMySubscription();
    setLoading(false);
  }, [loadMySubscription]);

  const getSubscriptionHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await getSubscriptionHistoryApi();

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setSubscriptionHistory(res.data.subscriptions || []);
    setLoading(false);
  }, []);

  const getPaymentHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await getPaymentHistoryApi();

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setPaymentHistory(res.data.payments || []);
    setLoading(false);
  }, []);

  const clearSubscription = useCallback(() => {
    setSubscription(null);
    setPlan(null);
    setPlans([]);
  }, []);

  const value = useMemo(() => ({
    plans,
    subscription,
    plan,
    loading,
    error,
    subscriptionHistory,
    paymentHistory,
    loadPlans,
    loadMySubscription,
    createPaymentIntent,
    cancelSubscription,
    clearSubscription,
    getSubscriptionHistory,
    getPaymentHistory,
    activateSubscription,
  }), [
    plans,
    subscription,
    plan,
    loading,
    error,
    subscriptionHistory,
    paymentHistory,
    loadPlans,
    loadMySubscription,
    createPaymentIntent,
    cancelSubscription,
    clearSubscription,
    getSubscriptionHistory,
    getPaymentHistory,
    activateSubscription,
  ]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
