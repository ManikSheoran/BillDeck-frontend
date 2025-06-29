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
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPurchase(form);
      navigate("/inventory"); // Or navigate to purchase list later
    } catch (error) {
      console.error("Failed to add purchase:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Purchase</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="supplier_name"
          placeholder="Supplier Name"
          value={form.supplier_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="product_id"
          placeholder="Product ID"
          value={form.product_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price_per_unit"
          placeholder="Price per unit"
          value={form.price_per_unit}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
          Add Purchase
        </button>
      </form>
    </div>
  );
}
