import { useEffect, useState } from "react";
import { getPurchaseUdhaar, clearPurchaseUdhaar } from "../../api/udhaarApi";

export default function ViewPurchaseUdhaar() {
  const [udhaarList, setUdhaarList] = useState([]);

  const fetchUdhaar = async () => {
    try {
      const response = await getPurchaseUdhaar();
      setUdhaarList(response.data);
    } catch (error) {
      console.error("Failed to load purchase udhaar:", error);
    }
  };

  const handleClear = async (id) => {
    try {
      await clearPurchaseUdhaar(id);
      fetchUdhaar();
    } catch (error) {
      console.error("Failed to clear purchase udhaar:", error);
    }
  };

  useEffect(() => {
    fetchUdhaar();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#653239] mb-6">Purchase Udhaar</h2>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="border px-4 py-3">ID</th>
              <th className="border px-4 py-3">Supplier</th>
              <th className="border px-4 py-3">Amount</th>
              <th className="border px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {udhaarList.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No outstanding purchases.
                </td>
              </tr>
            ) : (
              udhaarList.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gray-50 transition duration-150 text-center"
                >
                  <td className="border px-4 py-2">{entry.id}</td>
                  <td className="border px-4 py-2">{entry.supplier_name}</td>
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
