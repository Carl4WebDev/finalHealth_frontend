import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingRoutes from "./features/landing/routes.jsx";
import UserRoutes from "./features/user/routes.jsx";

import GuestRoute from "./features/landing/components/GuestRoutes.jsx";
import ProtectedRoutes from "./features/user/components/ProtectedRoutes.jsx";

import AdminRoutes from "./features/admin/routes.jsx";


import SubscriptionExpired from "./components/SubscriptionExpired.jsx";
import Chatbot from "./Chatbot.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Chatbot />
      <Routes>
        <Route path="/subscription-expired" element={<SubscriptionExpired />} />
        <Route
          path="/*"
          element={
            <GuestRoute>
              <LandingRoutes />
            </GuestRoute>
          }
        />
        <Route
          path="/user/*"
          element={
            <ProtectedRoutes>
              <UserRoutes />
            </ProtectedRoutes>
          }
        />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
