import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPurchaseById } from "../api/detailsApi";
import { FileTextIcon, ShoppingCartIcon, CalendarDaysIcon, PackageIcon, IndianRupeeIcon } from "lucide-react";

export default function PurchaseDetails() {
  const { purchaseId } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPurchaseById(purchaseId)
      .then((res) => {
        setPurchase(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load purchase details");
        setLoading(false);
      });
  }, [purchaseId]);

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!purchase)
    return <div className="p-8 text-gray-500">No details found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl animate-fade-in">
      <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
        <FileTextIcon className="w-6 h-6 text-green-600" /> Purchase Details
      </h2>

      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <ShoppingCartIcon className="w-4 h-4 text-green-600" />
          <span className="font-semibold">Purchase ID:</span> {purchase.purch_id}
        </div>
        <div className="flex items-center gap-2">
          <PackageIcon className="w-4 h-4 text-green-600" />
          <span className="font-semibold">Vendor ID:</span> {purchase.vendor_id}
        </div>
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="w-4 h-4 text-green-600" />
          <span className="font-semibold">Date:</span> {purchase.transaction_date}
        </div>
        <div className="flex items-center gap-2">
          <PackageIcon className="w-4 h-4 text-green-600" />
          <span className="font-semibold">Total Quantity:</span> {purchase.total_quantity}
        </div>
        <div className="flex items-center gap-2">
          <IndianRupeeIcon className="w-4 h-4 text-green-600" />
          <span className="font-semibold">Total Amount:</span> ₹{purchase.total_amount}
        </div>
      </div>

      {purchase.products && purchase.products.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-green-700 mb-2 flex items-center gap-1">
            <PackageIcon className="w-5 h-5 text-green-600" /> Products
          </h3>
          <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
            {purchase.products.map((p, i) => (
              <li key={i}>
                <span className="font-medium">{p.product_name}</span> — Qty: {p.quantity}, Purchase: ₹
                {p.purchase_price}, Selling: ₹{p.selling_price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}