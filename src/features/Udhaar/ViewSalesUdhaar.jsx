import { useEffect, useState } from "react";
import { getSalesUdhaar, clearSalesUdhaar } from "../../api/udhaarApi";

export default function ViewSalesUdhaar() {
  const [udhaarList, setUdhaarList] = useState([]);

  const fetchUdhaar = async () => {
    try {
      const response = await getSalesUdhaar();
      setUdhaarList(response.data);
    } catch (error) {
      console.error("Failed to load sales udhaar:", error);
    }
  };

  const handleClear = async (id) => {
    try {
      await clearSalesUdhaar(id);
      fetchUdhaar();
    } catch (error) {
      console.error("Failed to clear sales udhaar:", error);
    }
  };

  useEffect(() => {
    fetchUdhaar();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#653239] mb-6">Sales Udhaar</h2>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="border px-4 py-3">ID</th>
              <th className="border px-4 py-3">Customer</th>
              <th className="border px-4 py-3">Amount</th>
              <th className="border px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {udhaarList.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No outstanding sales.
                </td>
              </tr>
            ) : (
              udhaarList.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gray-50 transition duration-150 text-center"
                >
                  <td className="border px-4 py-2">{entry.id}</td>
                  <td className="border px-4 py-2">{entry.customer_name}</td>
                  <td className="border px-4 py-2">{entry.amount}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleClear(entry.id)}
                      className="bg-[#653239] hover:bg-[#AF7A6D] text-white px-3 py-1 rounded text-sm transition"
                    >
                      Clear
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}