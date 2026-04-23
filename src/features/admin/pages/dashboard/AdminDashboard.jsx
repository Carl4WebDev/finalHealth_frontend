import React, { useEffect } from "react";
import Header from "../../components/Header";
import AdminLayout from "../../components/AdminLayout";
import { useAdmin } from "../../context/useAdmin";

// --- ICONS SECTION (Defined outside the component) ---
const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const IconRefresh = ({ spinning }) => (
  <svg className={spinning ? "animate-spin" : ""} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
);

const IconBarChart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const IconUserCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
);

const IconCreditCard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
);

const IconUserPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="16" y1="11" x2="22" y2="11"></line></svg>
);

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

// --- HELPER COMPONENTS ---
function StatCard({ label, value, icon: Icon, color, bgColor, loading }) {
  return (
    <div className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: color }} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-100 animate-pulse rounded mt-2" />
          ) : (
            <p className="text-3xl font-bold mt-2" style={{ color }}>{value?.toLocaleString() || "0"}</p>
          )}
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ backgroundColor: bgColor, color }}>
          <Icon />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ item, index }) {
  return (
    <div className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
      <div className="w-2 h-2 rounded-full bg-blue-500" />
      <p className="text-sm text-gray-600">{item}</p>
    </div>
  );
}

function SummaryRow({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-semibold px-2.5 py-1 rounded-md ${colors[color] || "bg-gray-50"}`}>
        {value}
      </span>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function AdminDashboard() {
  const { dashboard, getDashboardData, loading } = useAdmin();

  useEffect(() => {
    getDashboardData();
  }, []);

  const handleRefresh = () => getDashboardData();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50/50 min-h-screen">
        <Header title="Dashboard" />

        <main className="mt-6 max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <section className="mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2133ff] to-[#4f5fff] p-8 text-white shadow-lg">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{getGreeting()}, Admin! 👋</h1>
                  <p className="mt-2 text-blue-100 flex items-center gap-2">
                    <IconCalendar /> {today}
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all backdrop-blur-sm"
                >
                  <IconRefresh spinning={loading} />
                  {loading ? "Updating..." : "Refresh"}
                </button>
              </div>
            </div>
          </section>
          
          {/* Overview Stats */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-[#2133ff]"><IconBarChart /></span>
              Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard label="Total Users" value={dashboard?.total_users} icon={IconUsers} color="#2133ff" bgColor="#eef0ff" loading={loading} />
              <StatCard label="Verified Doctors" value={dashboard?.verified_doctors} icon={IconUserCheck} color="#10b981" bgColor="#ecfdf5" loading={loading} />
              <StatCard label="Active Subscribers" value={dashboard?.active_subscribers} icon={IconCreditCard} color="#f59e0b" bgColor="#fffbeb" loading={loading} />
              <StatCard label="New Signups (30d)" value={dashboard?.new_signups} icon={IconUserPlus} color="#8b5cf6" bgColor="#f5f3ff" loading={loading} />
            </div>
          </section>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-[#2133ff]"><IconClock /></span>
                Recent Activity
              </h3>
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {dashboard?.recent_activities?.length > 0 ? (
                    dashboard.recent_activities.map((item, i) => (
                      <ActivityItem key={i} item={item.description} index={i} />
                    ))
                  ) : (
                    <p className="p-6 text-center text-gray-400 text-sm">No recent activity found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Today's Summary */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-[#2133ff]"><IconCalendar /></span>
                Today's Summary
              </h3>
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
                <div className="space-y-4">
                  <SummaryRow label="New Users" value={`+${dashboard?.today?.new_users || 0}`} color="blue" />
                  <SummaryRow label="Appointments" value={dashboard?.today?.appointments || 0} color="green" />
                  <SummaryRow label="Revenue" value={`₱${(dashboard?.today?.revenue || 0).toLocaleString()}`} color="amber" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}