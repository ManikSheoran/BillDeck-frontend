import { useState } from "react";
import { createPurchase } from "../../api/purchaseApi";
import { useNavigate } from "react-router-dom";

export default function AddPurchase() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    supplier_name: "",
    product_id: "",
    quantity: "",
    price_per_unit: "",
    purchase_date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPurchase(form);
      navigate("/inventory");
    } catch (error) {
      console.error("Failed to add purchase:", error);
    }
  };

  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200";

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold text-[#653239] mb-6">Add Purchase</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <input
          type="text"
          name="supplier_name"
          placeholder="Supplier Name"
          value={form.supplier_name}
          onChange={handleChange}
          className={inputClasses}
          required
        />

        <input
          type="text"
          name="product_id"
          placeholder="Product ID"
          value={form.product_id}
          onChange={handleChange}
          className={inputClasses}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className={inputClasses}
          required
          min={0}
        />

        <input
          type="number"
          name="price_per_unit"
          placeholder="Price per unit"
          value={form.price_per_unit}
          onChange={handleChange}
          className={inputClasses}
          required
          min={0}
        />

        <input
          type="date"
          name="purchase_date"
          value={form.purchase_date}
          onChange={handleChange}
          className={inputClasses}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#653239] text-white py-3 rounded-lg font-semibold hover:bg-[#AF7A6D] transition"
        >
          Add Purchase
        </button>
      </form>
    </div>
  );
}
