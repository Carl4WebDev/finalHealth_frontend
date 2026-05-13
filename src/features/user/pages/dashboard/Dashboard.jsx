import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";

import Layout from "../../components/Layout";
import { useDashboard } from "../../context/dashboard/useDashboard";

export default function Dashboard() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [activeTab, setActiveTab] = useState("clinics");

  const {
    summaryCards,
    analytics,
    upcomingAppointments,
    subscription,
    networkClinics,
    networkDoctors,
    loading,
    error,
    usage,
    getDashboardUsage,
    getDashboardOverview,
  } = useDashboard();

  useEffect(() => {
    getDashboardOverview();
    getDashboardUsage();
  }, []);

  const BuildingIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );

  const UsersIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  const CreditCardIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  );

  const CalendarIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const ClockIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  const ChevronIcon = ({ direction = "right" }) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transform ${direction === "down" ? "rotate-90" : ""}`}
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const CheckIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysLeft = (endDate) => {
    if (!endDate) return 0;

    const today = new Date();
    const end = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diff = end - today;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const planUsage = useMemo(() => {
    if (!subscription) {
      return {
        clinicsUsed: 0,
        clinicsTotal: 0,
        doctorsUsed: 0,
        doctorsTotal: 0,
        progress: 0,
      };
    }

    const clinicsUsed = summaryCards?.clinics ?? 0;
    const doctorsUsed = summaryCards?.doctors ?? 0;
    const clinicsTotal = subscription?.max_clinics ?? 0;
    const doctorsTotal = subscription?.max_doctors ?? 0;

    const clinicPercent =
      clinicsTotal > 0 ? (clinicsUsed / clinicsTotal) * 100 : 0;
    const doctorPercent =
      doctorsTotal > 0 ? (doctorsUsed / doctorsTotal) * 100 : 0;

    const progress = Math.round(Math.max(clinicPercent, doctorPercent));

    return {
      clinicsUsed,
      clinicsTotal,
      doctorsUsed,
      doctorsTotal,
      progress,
    };
  }, [subscription, summaryCards]);

  const stats = [
    {
      label: "Clinics",
      value: summaryCards?.clinics ?? 0,
      icon: <BuildingIcon />,
      change: "Registered clinics",
      color: "border-blue-200",
    },
    {
      label: "Doctors",
      value: summaryCards?.doctors ?? 0,
      icon: <UsersIcon />,
      change: "Registered doctors",
      color: "border-blue-200",
    },
    {
      label: "Subscription",
      value: subscription?.plan_name || "No Plan",
      sub: subscription ? `${getDaysLeft(subscription.end_date)} days left` : "",
      icon: <CreditCardIcon />,
      color: "border-purple-200",
      badge: subscription?.status || "",
    },
    {
      label: "Appointments",
      value: summaryCards?.appointments ?? 0,
      icon: <CalendarIcon />,
      change: "Total appointments",
      color: "border-blue-200",
    },
  ];

  const visibleAppointments = showAllAppointments
    ? upcomingAppointments
    : upcomingAppointments.slice(0, 2);

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "confirmed":
      case "scheduled":
      case "active":
        return "bg-blue-50 text-blue-700";
      case "pending":
        return "bg-blue-50 text-blue-700";
      case "on leave":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

 const renderAnalyticsSection = () => {
    // 1. Guard Clause: Show a loading state or nothing until data arrives
    if (!analytics || !usage) {
        return <div className="mb-8 p-10 bg-white rounded-xl border border-dashed border-gray-300 text-center text-gray-500">Loading intelligent insights...</div>;
    }

    // 2. Prepare Data for Charts
    const genderData = [
      { name: "Male", value: analytics.gender_dist?.male || 0, color: "#3B82F6" },
      { name: "Female", value: analytics.gender_dist?.female || 0, color: "#EC4899" },
      { name: "Other", value: analytics.gender_dist?.other || 0, color: "#94A3B8" },
    ];

    const actualPatients = (analytics.visit_types?.new || 0) + (analytics.visit_types?.returning || 0);

    const repeatRate = actualPatients > 0 
      ? Math.round((analytics.visit_types?.returning / actualPatients) * 100) 
      : 0;

    const totalRevenue = analytics.clinic_revenue?.reduce((acc, curr) => acc + curr.value, 0) || 0;

    return (
      <div className="space-y-6 mb-8">
        
        {/* ROW 1: ADVANCED STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* 1. TOTAL INCOME (New) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-500">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Clinic Income</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ₱{(analytics.clinic_revenue?.reduce((acc, curr) => acc + curr.value, 0) || 0).toLocaleString()}
          </p>
          <p className="text-xs text-green-600 mt-1 font-medium">From all clinics</p>
        </div>

          {/* NEW: Total Patients Card */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase">Total Patients</p>
            <div className="flex items-baseline mt-2">
              <p className="text-3xl font-bold text-gray-900">{analytics.total_patients || 0}</p>
              <p className="ml-2 text-xs text-gray-400">Registered</p>
            </div>
          </div>
          
          {/* No-Show Rate */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase">No-Show Rate</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-bold text-red-600">{analytics.noShowRate}%</p>
              <span className="text-xs text-gray-400 mb-1">Cancelled Appts</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3">
              <div 
                className="bg-red-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${analytics.noShowRate}%` }}
              ></div>
            </div>
          </div>



          {/* Repeat Visit Rate */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase">Repeat Rate</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{repeatRate}%</p>
            <p className="text-xs text-gray-400 mt-1 italic">Patient loyalty</p>
          </div>

          {/* New Patients This Month */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase">New Patients</p>
            <div className="flex items-baseline mt-2">
              <p className="text-3xl font-bold text-green-600">{analytics.new_this_month || 0}</p>
              <p className="ml-2 text-sm text-gray-500">this month</p>
            </div>
            <p className="text-xs text-gray-400 mt-1 italic">Growth trend</p>
          </div>
        </div>

        {/* ROW 2: VISUAL CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gender Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Gender Distribution</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Age Group Bar Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Patient Age Groups</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.ageDist}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderClinicCards = () => {
    return networkClinics.map((clinic) => (
      <div
        key={clinic.clinic_id}
        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200"
      >
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
            <BuildingIcon />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{clinic.clinic_name}</h3>
            <div className="flex items-center mt-1">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  clinic.is_verified ? "bg-blue-500" : "bg-gray-400"
                }`}
              ></div>
              <span className="text-xs text-gray-600">
                {clinic.is_verified ? "active" : "unverified"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-semibold text-blue-700">
              {clinic.doctors_count}
            </div>
            <div className="text-xs text-gray-600">Doctors</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-semibold text-blue-700">
              {clinic.patients_count}
            </div>
            <div className="text-xs text-gray-600">Patients</div>
          </div>
        </div>
      </div>
    ));
  };

  const renderDoctorCards = () => {
    return networkDoctors.map((doctor) => (
      <div
        key={doctor.doctor_id}
        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200"
      >
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
            <span className="font-semibold text-blue-700">
              {getInitials(doctor.doctor_name)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{doctor.doctor_name}</h3>
            <div className="text-xs text-gray-600 mt-1">
              {doctor.specialization || "No specialization"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-semibold text-blue-700">
              {doctor.clinics_count}
            </div>
            <div className="text-xs text-gray-600">Clinics</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-semibold text-blue-700">
              {doctor.patients_count}
            </div>
            <div className="text-xs text-gray-600">Patients</div>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          License: {doctor.license_number}
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen p-4 md:p-6">
          <div className="text-gray-700">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen p-4 md:p-6">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Practice overview at a glance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white border ${stat.color} rounded-lg p-4 shadow-sm hover:shadow transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>

                  <div className="mt-2">
                    {stat.sub && (
                      <p className="text-xs text-gray-500">{stat.sub}</p>
                    )}

                    {stat.change && (
                      <div className="flex items-center">
                        <span className="text-xs text-blue-600">
                          {stat.change}
                        </span>

                        {stat.badge && (
                          <span className="ml-2 text-xs px-2 py-1 rounded bg-purple-50 text-purple-700 capitalize">
                            {stat.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-2 rounded bg-blue-50">
                  <div className="text-blue-600">{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Upcoming Appointments
                </h2>
                <p className="text-gray-500 text-sm">Recent schedule</p>
              </div>

              <button
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setShowAllAppointments(!showAllAppointments)}
              >
                {showAllAppointments
                  ? "Show Less"
                  : `View All (${upcomingAppointments.length})`}
                <ChevronIcon direction={showAllAppointments ? "up" : "down"} />
              </button>
            </div>

            <div className="space-y-3">
              {visibleAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No upcoming appointments.
                </div>
              ) : (
                visibleAppointments.map((apt) => (
                  <div
                    key={apt.appointment_id}
                    className={`p-4 border rounded-lg ${
                      selectedAppointment === apt.appointment_id
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    } cursor-pointer transition-colors duration-200`}
                    onClick={() => setSelectedAppointment(apt.appointment_id)}
                  >
                    <div className="flex items-start">
                      <div className="mr-4 min-w-[90px]">
                        <div className="text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded text-center">
                          {formatDate(apt.appointment_date)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-center">
                          Appointment
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              Dr. {apt.doctor_name}
                            </h3>
                            <h3 className="font-semibold text-gray-900">
                              {apt.patient_name}
                            </h3>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                              apt.status
                            )}`}
                          >
                            {apt.status}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center space-x-3 text-sm">
                          <span className="text-blue-600 flex items-center">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {apt.appointment_type}
                          </span>
                          <span className="text-gray-500 flex items-center">
                            <ClockIcon className="mr-1" />
                            Scheduled
                          </span>
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                          {apt.clinic_name}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {!showAllAppointments && upcomingAppointments.length > 2 && (
                <div className="text-center text-sm text-blue-600 pt-2">
                  +{upcomingAppointments.length - 2} more appointments
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Subscription</h2>
                <p className="text-gray-500 text-sm">Current plan & usage</p>
              </div>
              <div className="p-2 rounded bg-purple-50">
                <CreditCardIcon className="text-purple-600" />
              </div>
            </div>

            {!subscription ? (
              <div className="text-gray-500">No active subscription.</div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <CheckIcon className="text-purple-600 mr-2" />
                    <span className="font-semibold text-gray-900">
                      {subscription.plan_name}
                    </span>
                    <span className="ml-3 text-sm text-purple-600 capitalize">
                      ● {subscription.status}
                    </span>
                  </div>
                </div>

                <div className="mb-6">

                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Renews: {formatDate(subscription.end_date)}</span>
                    <span>₱{Number(subscription.price).toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200">
                    <div className="text-lg font-semibold text-blue-700 mb-1">
                      {planUsage.clinicsUsed}
                    </div>
                    <div className="text-sm text-gray-600">Clinics</div>
                  </div>

                  <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200">
                    <div className="text-lg font-semibold text-blue-700 mb-1">
                      {planUsage.doctorsUsed}
                    </div>
                    <div className="text-sm text-gray-600">Doctors</div>
                  </div>
                </div>

                <Link to={"/user/subscription"}>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Manage Subscription
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Network</h2>
              <p className="text-gray-500 text-sm">Clinics and medical team</p>
            </div>

            <div className="flex bg-blue-50 rounded p-1">
              <button
                onClick={() => setActiveTab("clinics")}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors duration-200 ${
                  activeTab === "clinics"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-blue-700"
                }`}
              >
                Clinics ({networkClinics.length})
              </button>
              <button
                onClick={() => setActiveTab("doctors")}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors duration-200 ${
                  activeTab === "doctors"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-blue-700"
                }`}
              >
                Doctors ({networkDoctors.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeTab === "clinics" ? renderClinicCards() : renderDoctorCards()}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="w-full py-2 border border-dashed border-blue-300 text-blue-600 hover:border-blue-400 hover:text-blue-800 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mr-2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add {activeTab === "clinics" ? "New Clinic" : "New Doctor"}
            </button>
          </div>
        </div>
        {renderAnalyticsSection()}
      </div>
    </Layout>
  );
}