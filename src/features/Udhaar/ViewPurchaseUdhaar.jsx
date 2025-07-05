import { useEffect, useState } from "react";
import { getPurchaseUdhaar, clearPurchaseUdhaar } from "../../api/udhaarApi";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

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

  const handleClear = async (udhar_id) => {
    try {
      await clearPurchaseUdhaar(udhar_id);
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
      <h2 className="text-2xl font-semibold text-emerald-700 mb-6">
        Purchase Udhaar
      </h2>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="border px-4 py-3">Udhar ID</th>
              <th className="border px-4 py-3">Purchase Details</th>
              <th className="border px-4 py-3">Date of Entry</th>
              <th className="border px-4 py-3">Date of Payment</th>
              <th className="border px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {udhaarList.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No outstanding purchases.
                </td>
              </tr>
            ) : (
              udhaarList.map((entry, index) => (
                <motion.tr
                  key={entry.udhar_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition duration-150 text-center"
                >
                  <td className="border px-4 py-2">{entry.udhar_id}</td>
                  <td className="border px-4 py-2">
                    <Link
                      to={`/purchase/${entry.purch_id}`}
                      className="text-emerald-600 hover:underline"
                    >
                      View Purchase
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{entry.date_of_entry}</td>
                  <td className="border px-4 py-2">{entry.date_of_payment}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleClear(entry.udhar_id)}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      <CheckCircle2 size={16} /> Clear
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
