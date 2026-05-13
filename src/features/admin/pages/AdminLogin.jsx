import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAdmin } from "../api/adminApi.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErrors({});
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);

      if (!res || res.status === "error") {
        switch (res?.code) {
          case "INVALID_CREDENTIALS":
            setErrors({ form: "Invalid email or password" });
            break;

          case "ADMIN_INACTIVE":
            setErrors({ form: "Admin account is inactive" });
            break;

          case "RATE_LIMITED":
            setErrors({ form: "Too many attempts. Try again later." });
            break;

          default:
            setErrors({ form: res?.message || "Login failed" });
        }

        return;
      }

      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      navigate("/admin/admin-dashboard");
    } catch (error) {
      setErrors({
        form:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-teal-400 px-4">
      <div className="bg-white w-full max-w-md p-10 rounded-xl shadow-lg">
        <Link to={"/"}>
          <button className="mb-4 text-blue-700 hover:text-blue-900 text-sm font-semibold flex items-center gap-1">
            ← Back
          </button>
        </Link>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center mb-2">
            <div className="w-6 h-7 bg-blue-600 border-2 border-white rounded-sm relative">
              <div className="absolute w-1 h-1 bg-white rounded-full top-1 left-1/2 -translate-x-1/2 shadow-[0_-3px_0_white,0_-6px_0_white,0_3px_0_white]"></div>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-blue-700">FinalHealth</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {errors.form && (
            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
              {errors.form}
            </div>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Email"
            required
            disabled={loading}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Password"
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}