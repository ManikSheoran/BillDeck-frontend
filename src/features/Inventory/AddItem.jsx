import { useState } from "react";
import { addProduct } from "../../api/productApi";
import { useNavigate } from "react-router-dom";

export default function AddItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", quantity: "", price: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(form);
      navigate("/inventory");
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
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
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
}
