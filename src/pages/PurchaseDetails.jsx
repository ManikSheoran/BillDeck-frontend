import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPurchaseById } from "../api/detailsApi";

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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-[#653239]">
        Purchase Details
      </h2>
      <div className="mb-2">
        <b>Purchase ID:</b> {purchase.purch_id}
      </div>
      <div className="mb-2">
        <b>Vendor ID:</b> {purchase.vendor_id}
      </div>
      <div className="mb-2">
        <b>Date:</b> {purchase.transaction_date}
      </div>
      <div className="mb-2">
        <b>Total Quantity:</b> {purchase.total_quantity}
      </div>
      <div className="mb-2">
        <b>Total Amount:</b> ₹{purchase.total_amount}
      </div>
      {/* If you ever get products array, you can show it here */}
      {purchase.products && purchase.products.length > 0 && (
        <div className="mt-4">
          <b>Products:</b>
          <ul className="list-disc ml-6 mt-2">
            {purchase.products.map((p, i) => (
              <li key={i}>
                {p.product_name} — Qty: {p.quantity}, Purchase: ₹
                {p.purchase_price}, Selling: ₹{p.selling_price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
