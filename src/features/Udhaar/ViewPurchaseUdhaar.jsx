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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Purchase Udhaar</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Supplier</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {udhaarList.map((entry) => (
            <tr key={entry.id} className="text-center">
              <td className="border p-2">{entry.id}</td>
              <td className="border p-2">{entry.supplier_name}</td>
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
