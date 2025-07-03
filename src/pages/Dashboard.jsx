/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

export default function Dashboard() {
  const [todaySales, setTodaySales] = useState(0);
  const [profitLossData, setProfitLossData] = useState([]);
  const [salesUdhaarCount, setSalesUdhaarCount] = useState(0);
  const [purchaseUdhaarCount, setPurchaseUdhaarCount] = useState(0);
  const [todaySalesDetails, setTodaySalesDetails] = useState([]);
  const [todayPurchaseDetails, setTodayPurchaseDetails] = useState([]);
  const [todayUdhaarSales, setTodayUdhaarSales] = useState([]);
  const [todayUdhaarPurchases, setTodayUdhaarPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split("T")[0];

        const getLast7Dates = () => {
          const dates = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split("T")[0]);
          }
          return dates;
        };

        const dates = getLast7Dates();

        const weeklyProfitLossResponses = await Promise.all(
          dates.map((date) =>
            axios.get(`${BASE_URL}/api/profit-loss/by-date/${date}`)
          )
        );

        // Normalize: always 7 days, fill missing with 0
        const weeklyData = dates.map((date, idx) => {
          const res = weeklyProfitLossResponses[idx];
          const arr = Array.isArray(res.data) ? res.data : [res.data];
          if (arr.length && arr[0] && typeof arr[0].amount === "number") {
            return {
              date,
              amount: arr[0].amount,
              is_profit: arr[0].is_profit,
              sales_id: arr[0].sales_id ?? null,
            };
          } else {
            return {
              date,
              amount: 0,
              is_profit: false,
              sales_id: null,
            };
          }
        });

        const [
          salesUdhaarRes,
          purchaseUdhaarRes,
          allSalesRes,
          allPurchasesRes,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/api/udhaar/sales/`),
          axios.get(`${BASE_URL}/api/udhaar/purchases/`),
          axios.get(`${BASE_URL}/api/sales/`),
          axios.get(`${BASE_URL}/api/purchases/`),
        ]);

        const todaySalesEntries = allSalesRes.data.filter(
          (sale) => sale.transaction_date === today
        );
        const totalTodaySales = todaySalesEntries.reduce(
          (acc, sale) => acc + parseFloat(sale.total_amount || 0),
          0
        );

        setTodaySales(totalTodaySales);
        setProfitLossData(weeklyData);

        setSalesUdhaarCount(salesUdhaarRes.data?.length || 0);
        setPurchaseUdhaarCount(purchaseUdhaarRes.data?.length || 0);

        setTodaySalesDetails(todaySalesEntries);

        setTodayPurchaseDetails(
          allPurchasesRes.data.filter((pur) => pur.transaction_date === today)
        );

        setTodayUdhaarSales(salesUdhaarRes.data);

        setTodayUdhaarPurchases(purchaseUdhaarRes.data);

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#653239] mb-1">
            👋 Hello, welcome to your Dashboard!
          </h1>
          <div className="text-gray-500 text-base">
            Quick overview of your business performance and pending actions.
          </div>
        </div>
        <div className="flex gap-4">
          <StatCard label="Today's Sales" value={`₹ ${todaySales}`} />
          <StatCard label="Sales Udhaar" value={salesUdhaarCount} />
          <StatCard label="Purchase Udhaar" value={purchaseUdhaarCount} />
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="text-lg text-gray-500 mb-2 font-semibold">
                  Weekly Profit/Loss
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  Hover a bar for details. Green = Profit, Red = Loss
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-green-400 inline-block"></span>
                  <span className="text-xs text-gray-500">Profit</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-red-400 inline-block"></span>
                  <span className="text-xs text-gray-500">Loss</span>
                </div>
              </div>
            </div>
            <div className="h-40 flex items-end justify-center overflow-x-auto mt-2">
              <WeeklyProfitLossGraph data={profitLossData} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <TransactionTable
              title="Today's Sales"
              data={todaySalesDetails}
              columns={[
                "sales_id",
                "total_amount",
                "total_quantity",
                "customer_id",
              ]}
            />
            <TransactionTable
              title="Today's Purchases"
              data={todayPurchaseDetails}
              columns={[
                "purch_id",
                "total_amount",
                "total_quantity",
                "vendor_id",
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TransactionTable
              title="Sales Udhaar"
              data={todayUdhaarSales}
              columns={["udhar_id", "sales_id", "date_of_payment"]}
            />
            <TransactionTable
              title="Purchase Udhaar"
              data={todayUdhaarPurchases}
              columns={["udhar_id", "purch_id", "date_of_payment"]}
            />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e0e7ff] rounded-xl shadow p-6 text-center min-w-[120px]">
      <div className="text-base text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-[#653239]">{value}</div>
    </div>
  );
}

function WeeklyProfitLossGraph({ data }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  if (!data || data.length === 0)
    return <div className="text-gray-400">No data</div>;

  const max = Math.max(...data.map((d) => Math.abs(d.amount)), 1);

  return (
    <div className="flex items-end gap-4 h-32 w-full">
      {data.map((d, i) => {
        const height = Math.max((Math.abs(d.amount) / max) * 90, 6);
        const color = d.is_profit ? "bg-green-400" : "bg-red-400";
        const isActive = hoverIdx === i;
        return (
          <div
            key={i}
            className="flex flex-col items-center group cursor-pointer relative"
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            tabIndex={0}
          >
            <div
              className={`w-8 rounded-t transition-all duration-200 ${color} ${
                isActive ? "ring-2 ring-[#653239]" : ""
              }`}
              style={{ height: `${height}px` }}
              title={`₹${d.amount} (${d.date})`}
            ></div>
            <div className="text-xs mt-1 text-gray-500">
              {new Date(d.date).toLocaleDateString("en-GB", {
                weekday: "short",
              })}
            </div>
            {isActive && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 bg-white border shadow rounded p-2 text-xs min-w-[120px] text-center">
                <div>
                  <span className="font-semibold">
                    {d.is_profit ? "Profit" : "Loss"}
                  </span>
                </div>
                <div>
                  <span className="text-[#653239] font-bold">₹{d.amount}</span>
                </div>
                <div className="text-gray-500">
                  {new Date(d.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                {d.sales_id && (
                  <div className="mt-1">
                    <span className="text-gray-400">Sale ID:</span>{" "}
                    <span className="font-mono">{d.sales_id}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TransactionTable({ title, data, columns }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold text-[#653239] mb-2">{title}</h3>
      {data.length === 0 ? (
        <div className="text-gray-400">No data</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-2 py-1 border-b text-gray-600">
                    {col
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="px-2 py-1 border-b">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
