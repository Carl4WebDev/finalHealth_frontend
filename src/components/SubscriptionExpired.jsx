import { useLocation, useNavigate } from "react-router-dom";

const SubscriptionExpired = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const message =
    location.state?.message ||
    "Your subscription has expired. Please renew to continue.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          Subscription Expired
        </h1>

        <p className="mb-6 text-gray-600">{message}</p>

        <button
          onClick={() => navigate("/user/subscription")}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Go to Subscription Page
        </button>
      </div>
    </div>
  );
};

export default SubscriptionExpired;