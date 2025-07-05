/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSaleById } from "../api/detailsApi";
import { ReceiptText, CalendarDays, User, ShoppingCart, IndianRupee } from "lucide-react";

export default function SaleDetails() {
  const { saleId } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getSaleById(saleId)
      .then((res) => {
        setSale(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load sale details");
        setLoading(false);
      });
  }, [saleId]);

  if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!sale) return <div className="p-8 text-gray-500">No details found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-[#2f855a] flex items-center gap-2">
        <ReceiptText className="w-6 h-6" /> Sale Details
      </h2>

      <DetailRow label="Sale ID" value={sale.sales_id} icon={<ReceiptText className="w-4 h-4" />} />
      <DetailRow label="Customer ID" value={sale.customer_id} icon={<User className="w-4 h-4" />} />
      <DetailRow label="Date" value={sale.transaction_date} icon={<CalendarDays className="w-4 h-4" />} />
      <DetailRow label="Total Quantity" value={sale.total_quantity} icon={<ShoppingCart className="w-4 h-4" />} />
      <DetailRow
        label="Total Amount"
        value={`₹${sale.total_amount}`}
        icon={<IndianRupee className="w-4 h-4" />}
      />

      {sale.products && sale.products.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-[#2f855a] mb-2">Products:</h4>
          <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
            {sale.products.map((p, i) => (
              <li key={i}>
                <span className="font-medium text-gray-800">{p.product_name}</span> — Qty: {p.quantity}, Rate: ₹{p.rate}, Total: ₹{p.sale_price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, icon }) {
  return (
    <div className="flex items-center gap-2 mb-3 text-gray-700">
      <div className="text-[#2f855a]">{icon}</div>
      <div className="text-sm">
        <span className="font-semibold text-gray-800 mr-1">{label}:</span>
        {value}
      </div>
    </div>
  );
}