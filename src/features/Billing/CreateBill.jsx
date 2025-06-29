import { useState } from "react";
import { createSale } from "../../api/salesApi";
import { useNavigate } from "react-router-dom";

export default function CreateBill() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: "",
    product_id: "",
    quantity: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSale(form);
      navigate("/inventory"); 
    } catch (error) {
      console.error("Sale creation failed:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Sale / Bill</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="customer_name"
          placeholder="Customer Name"
          value={form.customer_name}
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Bill
        </button>
      </form>
    </div>
  );
}
