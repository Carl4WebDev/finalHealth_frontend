// src/api/subscriptionApi.js
const API_BASE = import.meta.env.VITE_API_BASE;

const getAuthToken = () => {
  return localStorage.getItem("user_token"); // your token key
};

// ---------------------------
// AUTH HEADERS
// ---------------------------
function authHeaders() {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ---------------------------
// SUBSCRIBE TO PLAN
// ---------------------------
export async function subscribeToPlan(planId, paymentMethod = "gcash") {
  const res = await fetch(`${API_BASE}/api/subscription-routes/subscribe`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      planId,
      paymentMethod,
    }),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Subscription failed");

  return data; // { subscription, payment, plan }
}

// ---------------------------
// GET ACTIVE SUBSCRIPTION
// ---------------------------
// GET ACTIVE SUBSCRIPTION
export async function getMySubscription() {
  const res = await fetch(`${API_BASE}/api/subscription-routes/me`, {
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!data.success)
    throw new Error(data.error || "Failed to get subscription");

  return {
    subscription: data.subscription,
    plan: data.plan || null,
  };
}

// ---------------------------
// GET AVAILABLE PLANS
// ---------------------------
export async function getSubscriptionPlans() {
  const res = await fetch(`${API_BASE}/api/subscription-routes/plans`, {
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to load plans");

  return data.plans;
}

// ---------------------------
// CANCEL MY SUBSCRIPTION (hard cancel)
// ---------------------------
export async function cancelMySubscription() {
  const res = await fetch(`${API_BASE}/api/subscription-routes-v2/payments/cancel`, {
    method: "POST",
    headers: authHeaders(),
  });

  const data = await res.json();
  if (data.status !== "success")
    throw new Error(data.message || "Failed to cancel subscription");

  return data.data.subscription;
}
