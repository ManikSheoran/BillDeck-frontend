import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../api/productApi";

export default function AddItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    product_name: "",
    price_purchase: "",
    price_sale: "",
    quantity: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct({
        product_name: form.product_name,
        price_purchase: parseFloat(form.price_purchase),
        price_sale: parseFloat(form.price_sale),
        quantity: parseInt(form.quantity, 10),
      });
      navigate("/inventory");
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200";

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold text-[#653239] mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <input
          type="text"
          name="product_name"
          placeholder="Product Name"
          value={form.product_name}
          onChange={handleChange}
          className={inputClasses}
          required
        />

        <input
          type="number"
          name="price_purchase"
          placeholder="Purchase Price"
          value={form.price_purchase}
          onChange={handleChange}
          className={inputClasses}
          required
          min={0}
        />

        <input
          type="number"
          name="price_sale"
          placeholder="Sale Price"
          value={form.price_sale}
          onChange={handleChange}
          className={inputClasses}
          required
          min={0}
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

        <button
          type="submit"
          className="w-full bg-[#653239] text-white py-3 rounded-lg font-semibold hover:bg-[#AF7A6D] transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}