import { apiRequest } from "../../../api/httpClient/httpClient";

// GET plans
export const getSubscriptionPlansApi = () =>
  apiRequest("/api/subscription-routes/plans");

// GET my subscription
export const getMySubscriptionApi = () =>
  apiRequest("/api/subscription-routes/me");

// GET subscription history
export const getSubscriptionHistoryApi = () =>
  apiRequest("/api/subscription-routes/history");

// GET payment history
export const getPaymentHistoryApi = () =>
  apiRequest("/api/subscription-routes/payments");

// Cancel subscription
export const cancelMySubscriptionApi = () =>
  apiRequest("/api/subscription-routes-v2/payments/cancel", {
    method: "POST",
  });

// Subscribe
export const subscribeToPlanApi = (payload) =>
  apiRequest("/api/subscription-routes/subscribe", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Stripe payment intent
export const createPaymentIntentApi = (planId) =>
  apiRequest("/api/subscription-routes-v2/payments/intent", {
    method: "POST",
    body: JSON.stringify({ planId }),
  });

export const activateSubscriptionApi = (payload) =>
  apiRequest("/api/subscription-routes-v2/payments/activate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
