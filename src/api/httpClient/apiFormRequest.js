const API_BASE = import.meta.env.VITE_API_BASE;

const getAuthToken = () =>
  localStorage.getItem("admin_token") || localStorage.getItem("user_token");

export const apiFormRequest = async (url, options = {}) => {
  try {
    const token = getAuthToken();

    const response = await fetch(API_BASE + url, {
      method: options.method || "POST",
      body: options.body,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const message = body?.message || "Request failed";

      return {
        ok: false,
        success: false,
        status: response.status,
        message,
        error: message,
        code: body?.code || "UNKNOWN_ERROR",
        details: body?.details || null,
      };
    }

    return {
      ok: true,
      success: true,
      data: body?.data ?? body,
      message: body?.message || null,
    };
  } catch {
    return {
      ok: false,
      success: false,
      status: 0,
      message: "Network error",
      error: "Network error",
      code: "NETWORK_ERROR",
    };
  }
};
