import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSaleById } from "../api/detailsApi";

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

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!sale) return <div className="p-8 text-gray-500">No details found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-[#653239]">Sale Details</h2>
      <div className="mb-2">
        <b>Sale ID:</b> {sale.sales_id}
      </div>
      <div className="mb-2">
        <b>Customer ID:</b> {sale.customer_id}
      </div>
      <div className="mb-2">
        <b>Date:</b> {sale.transaction_date}
      </div>
      <div className="mb-2">
        <b>Total Quantity:</b> {sale.total_quantity}
      </div>
      <div className="mb-2">
        <b>Total Amount:</b> ₹{sale.total_amount}
      </div>
      {/* If you ever get products array, you can show it here */}
      {sale.products && sale.products.length > 0 && (
        <div className="mt-4">
          <b>Products:</b>
          <ul className="list-disc ml-6 mt-2">
            {sale.products.map((p, i) => (
              <li key={i}>
                {p.product_name} — Qty: {p.quantity}, Rate: {p.rate}, Total: ₹
                {p.sale_price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
