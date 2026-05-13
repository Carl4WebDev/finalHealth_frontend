import { useState } from "react";
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



  const activateSubscription = async (payload) => {
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
};
  // -----------------------------
  // Load plans
  // -----------------------------
  const loadPlans = async () => {
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
  };

  // -----------------------------
  // Load my subscription (/me)
  // -----------------------------
  const loadMySubscription = async () => {
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
  };

  // -----------------------------
  // Create Stripe PaymentIntent
  // -----------------------------
  const createPaymentIntent = async (planId) => {
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
  };

  // -----------------------------
  // Cancel subscription
  // -----------------------------
  const cancelSubscription = async () => {
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
  };

  const getSubscriptionHistory = async () => {
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
};

const getPaymentHistory = async () => {
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
};

  // -----------------------------
  // Clear (logout / switch user)
  // -----------------------------
  const clearSubscription = () => {
    setSubscription(null);
    setPlan(null);
    setPlans([]);
  };
  

  return (
    <SubscriptionContext.Provider
      value={{
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
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
