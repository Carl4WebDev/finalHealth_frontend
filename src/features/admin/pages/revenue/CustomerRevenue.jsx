import React, { useEffect, useState, useMemo } from "react";
import { useAdmin } from "../../context/useAdmin";
import AdminLayout from "../../components/AdminLayout";
import Header from "../../components/Header";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Simple icons
const IconSearch = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="7" cy="7" r="6" />
    <line x1="11" y1="11" x2="15" y2="15" />
  </svg>
);

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function CustomerRevenue() {
  const { revenue, isRevenueLoading, getRevenue } = useAdmin();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortBy, setSortBy] = useState("amount");

  useEffect(() => {
    getRevenue();
  }, [getRevenue]);

  // ---- GROUP DATA PER CUSTOMER ----
  const customers = useMemo(() => {
    const grouped = {};

    revenue.forEach((item) => {
      const id = item.user_id;

      if (!grouped[id]) {
        grouped[id] = {
          user_id: id,
          name: `${item.f_name} ${item.l_name}`,
          email: item.email || "N/A",
          total: 0,
          transactions: 0,
          lastPayment: item.payment_date,
          history: [],
        };
      }

      grouped[id].total += parseFloat(item.amount);
      grouped[id].transactions += 1;

      if (new Date(item.payment_date) > new Date(grouped[id].lastPayment)) {
        grouped[id].lastPayment = item.payment_date;
      }

      grouped[id].history.push(item);
    });

    return Object.values(grouped);
  }, [revenue]);

  // ---- MONTHLY REVENUE (derived from real revenue data) ----
  const monthlyData = useMemo(() => {
    const map = {};

    revenue.forEach((item) => {
      const d = new Date(item.payment_date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map[key]) {
        map[key] = {
          year: d.getFullYear(),
          monthIndex: d.getMonth(),
          label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
          shortLabel: MONTH_NAMES[d.getMonth()],
          total: 0,
        };
      }
      map[key].total += parseFloat(item.amount);
    });

    // Sort by date ascending, take last 6 months max
    return Object.values(map)
      .sort((a, b) =>
        a.year !== b.year
          ? a.year - b.year
          : a.monthIndex - b.monthIndex
      )
      .slice(-6);
  }, [revenue]);

  // ---- THIS MONTH INCOME ----
  const thisMonthRevenue = useMemo(() => {
    const now = new Date();
    return revenue.reduce((sum, item) => {
      const d = new Date(item.payment_date);
      if (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      ) {
        return sum + parseFloat(item.amount);
      }
      return sum;
    }, 0);
  }, [revenue]);

  // ---- LAST MONTH INCOME (for % change) ----
  const lastMonthRevenue = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return revenue.reduce((sum, item) => {
      const d = new Date(item.payment_date);
      if (
        d.getMonth() === lastMonth.getMonth() &&
        d.getFullYear() === lastMonth.getFullYear()
      ) {
        return sum + parseFloat(item.amount);
      }
      return sum;
    }, 0);
  }, [revenue]);

  const monthChangePercent = useMemo(() => {
    if (lastMonthRevenue === 0) return null;
    return (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1);
  }, [thisMonthRevenue, lastMonthRevenue]);

  // ---- CURRENT MONTH LABEL ----
  const currentMonthLabel = useMemo(() => {
    const now = new Date();
    return `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
  }, []);

  // ---- FILTER + SEARCH ----
  let filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // ---- SORT ----
  filtered.sort((a, b) => {
    if (sortBy === "amount") return b.total - a.total;
    if (sortBy === "transactions") return b.transactions - a.transactions;
    return a.name.localeCompare(b.name);
  });

  const totalRevenue = customers.reduce((sum, c) => sum + c.total, 0);

  // Highlight the current month bar
  const nowMonthIndex = new Date().getMonth();
  const nowYear = new Date().getFullYear();

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <Header title="Customer Revenue" />

        {/* ---- SUMMARY CARDS ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
          {/* Total Revenue */}
          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Revenue</p>
            <h2 className="text-2xl font-bold mt-2" style={{ color: "#2133ff" }}>
              ₱{totalRevenue.toLocaleString()}
            </h2>
          </div>

          {/* This Month */}
          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {currentMonthLabel}
            </p>
            <h2 className="text-2xl font-bold mt-2 text-gray-800">
              ₱{thisMonthRevenue.toLocaleString()}
            </h2>
            {monthChangePercent !== null && (
              <span
                className={`text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded ${
                  parseFloat(monthChangePercent) >= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {parseFloat(monthChangePercent) >= 0 ? "+" : ""}
                {monthChangePercent}% vs last month
              </span>
            )}
          </div>

          {/* Customers */}
          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Customers</p>
            <h2 className="text-2xl font-bold mt-2">{customers.length}</h2>
          </div>

          {/* Transactions */}
          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Transactions</p>
            <h2 className="text-2xl font-bold mt-2">{revenue.length}</h2>
          </div>
        </div>

        {/* ---- MONTHLY REVENUE CHART ---- */}
        {monthlyData.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Monthly Revenue</h3>
              <span className="text-xs text-gray-400">
                {monthlyData.length > 1
                  ? `${monthlyData[0].label} – ${monthlyData[monthlyData.length - 1].label}`
                  : monthlyData[0]?.label}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyData} barSize={36}>
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
                  width={48}
                />
                <Tooltip
                  formatter={(value) => [`₱${value.toLocaleString()}`, "Revenue"]}
                  labelFormatter={(label) => label}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry) => (
                    <Cell
                      key={`${entry.year}-${entry.monthIndex}`}
                      fill={
                        entry.monthIndex === nowMonthIndex &&
                        entry.year === nowYear
                          ? "#2133ff"
                          : "#a5b4fc"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#2133ff" }} />
                Current month
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#a5b4fc" }} />
                Previous months
              </span>
            </div>
          </div>
        )}

        {/* ---- TABLE ---- */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Controls */}
          <div className="p-5 border-b flex flex-col sm:flex-row justify-between gap-3">
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="Search customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm"
            >
              <option value="amount">Highest Revenue</option>
              <option value="transactions">Most Transactions</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{ background: "#2133ff" }}
                  className="text-white text-xs uppercase"
                >
                  <th className="p-4 text-left font-semibold">Customer</th>
                  <th className="p-4 text-left font-semibold">Transactions</th>
                  <th className="p-4 text-left font-semibold">Last Payment</th>
                  <th className="p-4 text-right font-semibold">Total</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {isRevenueLoading ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-400">
                      No data found
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr
                      key={c.user_id}
                      onClick={() => setSelectedUser(c)}
                      className="hover:bg-blue-50 cursor-pointer transition"
                    >
                      <td className="p-4">
                        <p className="font-medium text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </td>
                      <td className="p-4 text-sm">{c.transactions}</td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(c.lastPayment).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right font-bold">
                        ₱{c.total.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---- MODAL ---- */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
              <div className="flex justify-between mb-4">
                <h2 className="font-bold text-lg">Customer Details</h2>
                <button onClick={() => setSelectedUser(null)}>✕</button>
              </div>

              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-sm text-gray-400 mb-4">{selectedUser.email}</p>

              <div className="mb-4">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-xl font-bold" style={{ color: "#2133ff" }}>
                  ₱{selectedUser.total.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedUser.history.map((h) => (
                  <div key={h.transaction_id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>{h.plan_name}</span>
                      <span>₱{parseFloat(h.amount).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(h.payment_date).toLocaleDateString()} •{" "}
                      {h.payment_method}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}