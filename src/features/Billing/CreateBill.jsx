import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSale } from "../../api/salesApi";
import jsPDF from "jspdf";

export default function CreateBill() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    customer_name: "",
    phone_no: "",
    transaction_date: today,
    payment_due_date: today,
    bill_paid: true,
    products: [{ product_name: "", quantity: 0, rate: 0, sale_price: 0 }],
  });

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleProductChange = (index, { target: { name, value, type } }) => {
    const updated = [...form.products];
    updated[index][name] = type === "number" ? Number(value) : value;
    if (name === "quantity" || name === "rate") {
      const qty = Number(updated[index].quantity || 0);
      const rate = Number(updated[index].rate || 0);
      updated[index].sale_price = qty * rate;
    }
    setForm((prev) => ({ ...prev, products: updated }));
  };

  const addProduct = () => {
    setForm((prev) => ({
      ...prev,
      products: [...prev.products, { product_name: "", quantity: 0, rate: 0, sale_price: 0 }],
    }));
  };

  const removeProduct = (index) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.products.length) return alert("At least one product is required.");

    try {
      await createSale(form);
      navigate("/inventory");
    } catch (err) {
      console.error("Sale creation failed:", err);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Customer: " + form.customer_name, 10, 10);
    doc.text("Phone: " + form.phone_no, 10, 20);
    doc.text("Date: " + form.transaction_date, 10, 30);
    doc.text("Due: " + form.payment_due_date, 10, 40);

    let y = 60;
    form.products.forEach((p, i) => {
      doc.text(
        `${i + 1}. ${p.product_name} - Qty: ${p.quantity}, Rate: ${p.rate}, Total: ${p.sale_price}`,
        10,
        y
      );
      y += 10;
    });
    doc.save("bill.pdf");
  };

  const inputBase = "w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#653239]";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Bill</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { id: "customer_name", label: "Customer Name", type: "text" },
            { id: "phone_no", label: "Phone Number", type: "text" },
            { id: "transaction_date", label: "Transaction Date", type: "date" },
            { id: "payment_due_date", label: "Payment Due Date", type: "date" },
          ].map(({ id, label, type }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm mb-1 text-gray-600">{label}</label>
              <input
                id={id}
                name={id}
                type={type}
                value={form[id]}
                onChange={handleChange}
                className={inputBase}
                required
              />
            </div>
          ))}
        </div>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="bill_paid"
            checked={form.bill_paid}
            onChange={handleChange}
            className="w-4 h-4 accent-[#653239]"
          />
          <span className="text-sm text-gray-700">Bill Paid</span>
        </label>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Products</h3>
          {form.products.map((prod, idx) => (
            <div key={idx} className="grid md:grid-cols-4 gap-4 relative border p-4 rounded-lg bg-gray-50">
              {["product_name", "quantity", "rate", "sale_price"].map((field) => (
                <div key={field}>
                  <label className="block text-xs text-gray-600 mb-1 capitalize">{field.replace("_", " ")}</label>
                  <input
                    type={field === "product_name" ? "text" : "number"}
                    name={field}
                    value={prod[field]}
                    onChange={(e) => handleProductChange(idx, e)}
                    className={inputBase}
                    required
                    min={field !== "product_name" ? 0 : undefined}
                    disabled={field === "sale_price"}
                  />
                </div>
              ))}
              {form.products.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProduct(idx)}
                  className="absolute top-2 right-2 text-red-500 text-sm hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addProduct}
            className="px-4 py-2 rounded bg-[#653239] text-white hover:bg-[#AF7A6D]"
          >
            + Add Product
          </button>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="py-3 px-5 rounded-lg bg-[#653239] text-white font-semibold hover:bg-[#AF7A6D] transition"
          >
            Download PDF
          </button>
          <button
            type="submit"
            className="py-3 px-6 rounded-lg bg-[#653239] text-white font-semibold hover:bg-[#AF7A6D] transition"
          >
            Create Bill
          </button>
        </div>
      </form>
    </div>
  );
} 
