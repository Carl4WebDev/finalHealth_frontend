import { useState, useCallback, useMemo } from "react";
import { UserContext } from "./UserContext.jsx";
import {
  loginUser,
  registerUser,
  updateUserSettingsApi,
  getPersonalInfoApi,
  updateProfileImageApi,
} from "../../api/userApi.js";

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshUser = useCallback(async () => {
    const res = await getPersonalInfoApi();
    if (!res.ok) return;

    const user = res.data.userInfo;

    setUserInfo({
      ...user,
      profileImgUrl: user.profileImgUrl
        ? `${user.profileImgUrl}?t=${Date.now()}`
        : null,
    });
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    const res = await loginUser(email, password);

    if (!res?.ok) {
      setError(res?.message || "Login failed");
      setLoading(false);
      return res;
    }

    localStorage.setItem("user_token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    await refreshUser();

    setLoading(false);
    return res;
  }, [refreshUser]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);

    const res = await registerUser(payload);

    if (!res?.ok) {
      setError(res?.message || "Registration failed");
      setLoading(false);
      return res;
    }

    setLoading(false);
    return res;
  }, []);

  const getPersonalInfo = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await getPersonalInfoApi();

    if (!res?.ok) {
      setError(res?.message || "Failed to load profile");
      setLoading(false);
      return res;
    }
    console.log(res.data.userInfo);
    setUserInfo(res.data.userInfo);
    setLoading(false);
    return res;
  }, []);

  const updateSettings = useCallback(async (payload) => {
    setLoading(true);
    setError(null);

    console.log(payload);
    const res = await updateUserSettingsApi(payload);

    if (!res?.success) {
      setError(res?.error || "Failed to update settings");
      setLoading(false);
      return res;
    }

    setLoading(false);
    return res;
  }, []);

  const updateProfileImage = useCallback(async (imageFile) => {
    setLoading(true);
    setError(null);

    try {
      const res = await updateProfileImageApi(imageFile);

      if (!res?.status.success) {
        throw new Error(res?.error || "Failed to upload image");
      }

      refreshUser().catch(() => {
        console.warn("User refresh failed after image upload");
      });

      setLoading(false);
      return res;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [refreshUser]);

  const clearUser = useCallback(() => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user");
    setUserInfo(null);
  }, []);

  const value = useMemo(() => ({
    userInfo,
    loading,
    error,
    login,
    register,
    clearUser,
    getPersonalInfo,
    refreshUser,
    updateSettings,
    updateProfileImage,
  }), [
    userInfo,
    loading,
    error,
    login,
    register,
    clearUser,
    getPersonalInfo,
    refreshUser,
    updateSettings,
    updateProfileImage,
  ]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
