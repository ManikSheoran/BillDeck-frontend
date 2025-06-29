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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Udhaar</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {udhaarList.map((entry) => (
            <tr key={entry.id} className="text-center">
              <td className="border p-2">{entry.id}</td>
              <td className="border p-2">{entry.customer_name}</td>
              <td className="border p-2">{entry.amount}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleClear(entry.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Clear
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
