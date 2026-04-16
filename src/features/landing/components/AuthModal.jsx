import React, { useState, useEffect } from "react";
import { loginUser, registerUser } from "../../user/api/userApi";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ mode, onClose, onSwitchMode }) => {
  const navigate = useNavigate();

  // camelCase DTO-ready state
  const [formData, setFormData] = useState({
    fName: "",
    mName: "",
    lName: "",
    email: "",
    contactNum: "",
    address: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Map IDs → camelCase DTO fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    const keyMap = {
      loginEmail: "email",
      loginPassword: "password",
      registerEmail: "email",
      registerPassword: "password",

      fName: "fName",
      mName: "mName",
      lName: "lName",
      contactNum: "contactNum",
      birthDate: "birthDate",
    };

    const fieldKey = keyMap[id] || id;

    setFormData((prev) => ({ ...prev, [fieldKey]: value }));

    if (errors[fieldKey]) {
      setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
    }
  };

  // Validation aligned to camelCase
  const validateForm = () => {
    const newErrors = {};

    if (mode === "login") {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
    } else {
      if (!formData.fName) newErrors.fName = "First name is required";
      if (!formData.mName) newErrors.mName = "Middle name is required";
      if (!formData.lName) newErrors.lName = "Last name is required";

      if (!formData.email || !formData.email.includes("@"))
        newErrors.email = "Enter a valid email";

      if (!formData.contactNum)
        newErrors.contactNum = "Contact number is required";

      if (!formData.address) newErrors.address = "Address is required";

      if (!formData.birthDate) newErrors.birthDate = "Birth date is required";

      if (formData.password.length < 8)
        newErrors.password = "Minimum 8 characters";

      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler for login/register
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // ---------- LOGIN ----------
if (mode === "login") {
  const res = await loginUser(formData.email, formData.password);

  console.log("LOGIN RESPONSE:", res);

  if (!res.ok) {
    if (res.code === "INVALID_CREDENTIALS") {
      setErrors({ password: "Invalid email or password" });
    } else {
      setErrors({ form: res.message });
    }

    setLoading(false);
    return;
  }

  localStorage.setItem("user_token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  // ✅ Redirect expired users immediately after login
  if (res.data.subscriptionStatus === "expired") {
    setLoading(false);
    onClose();

    navigate("/subscription-expired", {
      state: {
        message:
          res.data.subscriptionMessage ||
          "Your subscription has expired. Please renew to continue.",
      },
    });

    return;
  }

  setLoading(false);
  onClose();
  navigate("/user/subscription");
}
    // ---------- REGISTER ----------
    if (mode === "register") {
      const payload = {
        fName: formData.fName,
        mName: formData.mName,
        lName: formData.lName,
        email: formData.email,
        contactNum: formData.contactNum,
        address: formData.address,
        birthDate: formData.birthDate,
        password: formData.password,
      };

      const res = await registerUser(payload);

      if (!res.ok) {
        if (res.code === "EMAIL_EXISTS") {
          setErrors({ email: "Email already exists" });
        } else {
          setErrors({ form: res.message });
        }

        setLoading(false);
        return;
      }

      setLoading(false);
      onSwitchMode("login");
      return;
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
  <div
    className="fixed inset-0 bg-blue-50/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"

      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-2xl border-4 border-blue-600 shadow-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          &times;
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
            <div className="w-4 h-5 bg-blue-600 border-2 border-white rounded-sm relative">
              <div className="absolute w-1 h-1 bg-white rounded-full top-1 left-1/2 transform -translate-x-1/2 shadow-[0_-3px_0_white,0_-6px_0_white,0_3px_0_white]"></div>
            </div>
          </div>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            FinalHealth
          </span>
        </div>

        {/* ---------- LOGIN FORM ---------- */}
        {mode === "login" && (
          <form onSubmit={handleSubmit}>
            {errors.form && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {errors.form}
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="loginEmail"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="loginEmail"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="loginPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="loginPassword"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <div className="text-center mt-6">
              <span className="text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => onSwitchMode("register")}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Create Account
                </button>
              </span>
              <br />
              <span className="text-gray-600 dark:text-gray-400">
                <button
                  type="button"
                  onClick={() => navigate("/admin/admin-login")}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-sm"
                >
                  Login as ADMIN
                </button>
              </span>
            </div>
          </form>
        )}

        {/* ---------- REGISTER FORM ---------- */}
        {mode === "register" && (
          <form onSubmit={handleSubmit}>
            {errors.form && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {errors.form}
              </div>
            )}

            <div className="space-y-4">
              {/* First / Middle / Last Names */}
              {[
                {
                  id: "fName",
                  label: "First Name",
                  hint: "Enter your given name.",
                },
                {
                  id: "mName",
                  label: "Middle Name",
                  hint: "Use N/A if not applicable.",
                },
                {
                  id: "lName",
                  label: "Last Name",
                  hint: "Your surname or family name.",
                },
              ].map((item) => (
                <div key={item.id}>
                  <label
                    htmlFor={item.id}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {item.label}*
                  </label>
                  <p className="text-xs text-gray-500 mb-1">{item.hint}</p>
                  <input
                    type="text"
                    id={item.id}
                    value={formData[item.id]}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      errors[item.id]
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder={`Enter ${item.label.toLowerCase()}`}
                  />
                  {errors[item.id] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[item.id]}
                    </p>
                  )}
                </div>
              ))}

              {/* Email */}
              <div>
                <label
                  htmlFor="registerEmail"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email*
                </label>
                <p className="text-xs text-gray-500 mb-1">
                  This will be your login email.
                </p>
                <input
                  type="email"
                  id="registerEmail"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label
                  htmlFor="contactNum"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Contact Number*
                </label>
                <p className="text-xs text-gray-500 mb-1">
                  Use a valid phone number.
                </p>
                <input
                  type="tel"
                  id="contactNum"
                  value={formData.contactNum}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.contactNum
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.contactNum && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactNum}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Address*
                </label>
                <p className="text-xs text-gray-500 mb-1">
                  Format: Street, City, Province.
                </p>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.address
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Birth Date*
                </label>
                <input
                  type="date"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.birthDate
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.birthDate}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="registerPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password*
                </label>
                <input
                  type="password"
                  id="registerPassword"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Confirm Password*
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>

            {/* Switch to login */}
            <div className="text-center mt-6">
              <span className="text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => onSwitchMode("login")}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Login
                </button>
              </span>
              <br />
              <span className="text-gray-600 dark:text-gray-400">
                <button
                  type="button"
                  onClick={() => navigate("/admin/admin-register")}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-sm"
                >
                  Register as ADMIN
                </button>
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
