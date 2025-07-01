import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSale } from "../../api/salesApi";
import { createPurchase } from "../../api/purchaseApi";
import jsPDF from "jspdf";

export default function CreateBill() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [isSale, setIsSale] = useState(true);

  const [form, setForm] = useState({
    customer_name: "",
    vendor_name: "",
    phone_no: "",
    transaction_date: today,
    payment_due_date: today,
    bill_paid: true,
    products: [
      {
        product_name: "",
        quantity: 0,
        rate: 0,
        sale_price: 0,
        price_purchase: 0,
        price_sale: 0,
      },
    ],
  });

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProductChange = (index, { target: { name, value, type } }) => {
    const updated = [...form.products];
    updated[index][name] = type === "number" ? Number(value) : value;

    // For sale, auto-calculate sale_price if quantity or rate changes
    if (isSale && (name === "quantity" || name === "rate")) {
      const qty = Number(updated[index].quantity) || 0;
      const rate = Number(updated[index].rate) || 0;
      updated[index].sale_price = qty * rate;
    }
    setForm((prev) => ({ ...prev, products: updated }));
  };

  const addProduct = () => {
    setForm((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          product_name: "",
          quantity: 0,
          rate: 0,
          sale_price: 0,
          price_purchase: 0,
          price_sale: 0,
        },
      ],
    }));
  };

  const removeProduct = (index) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  // Total for sale: sum of sale_price; for purchase: sum of quantity * price_purchase
  const totalAmount = isSale
    ? form.products.reduce((sum, p) => sum + (Number(p.sale_price) || 0), 0)
    : form.products.reduce(
        (sum, p) => sum + (Number(p.quantity) * Number(p.price_purchase) || 0),
        0
      );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.products.length)
      return alert("At least one product is required.");

    try {
      if (isSale) {
        const salePayload = {
          customer_name: form.customer_name,
          phone_no: form.phone_no,
          products: form.products.map((p) => ({
            product_name: p.product_name,
            quantity: p.quantity,
            rate: p.rate,
            sale_price: p.sale_price,
            total_amount: totalAmount,
          })),
          transaction_date: form.transaction_date,
          bill_paid: form.bill_paid,
          payment_due_date: form.payment_due_date,
          total_amount: totalAmount,
        };
        await createSale(salePayload);
      } else {
        const purchasePayload = {
          vendor_name: form.vendor_name,
          phone_no: form.phone_no,
          products: form.products.map((p) => ({
            product_name: p.product_name,
            quantity: p.quantity,
            price_purchase: p.price_purchase,
            price_sale: p.price_sale,
          })),
          transaction_date: form.transaction_date,
          bill_paid: form.bill_paid,
          payment_due_date: form.payment_due_date,
          total_amount: totalAmount,
        };
        await createPurchase(purchasePayload);
      }
      navigate("/inventory");
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(
      isSale
        ? "Customer: " + form.customer_name
        : "Vendor: " + form.vendor_name,
      10,
      10
    );
    doc.text("Phone: " + form.phone_no, 10, 20);
    doc.text("Date: " + form.transaction_date, 10, 30);
    doc.text("Due: " + form.payment_due_date, 10, 40);

    let y = 60;
    form.products.forEach((p, i) => {
      let line = "";
      if (isSale) {
        line = `${i + 1}. ${p.product_name} - Qty: ${p.quantity}, Rate: ${
          p.rate
        }, Total: ${p.sale_price}`;
      } else {
        line = `${i + 1}. ${p.product_name} - Qty: ${p.quantity}, Purchase: ${
          p.price_purchase
        }, Selling: ${p.price_sale}, Total: ${
          p.quantity * p.price_purchase
        }`;
      }
      doc.text(line, 10, y);
      y += 10;
    });

    doc.text(`Total Amount: ₹ ${totalAmount}`, 10, y + 10);
    doc.save(isSale ? "bill.pdf" : "purchase.pdf");
  };

  const inputBase =
    "w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#653239]";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <span
          className={`cursor-pointer px-3 py-1 rounded-full text-sm font-semibold ${
            isSale ? "bg-[#653239] text-white" : "bg-gray-100 text-[#653239]"
          }`}
          onClick={() => setIsSale(true)}
        >
          Sale
        </span>
        <span
          className={`cursor-pointer px-3 py-1 rounded-full text-sm font-semibold ${
            !isSale ? "bg-[#653239] text-white" : "bg-gray-100 text-[#653239]"
          }`}
          onClick={() => setIsSale(false)}
        >
          Purchase
        </span>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {isSale ? "Create Bill" : "Create Purchase"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow"
      >
        <div className="grid md:grid-cols-2 gap-4">
          {isSale ? (
            <div>
              <label
                htmlFor="customer_name"
                className="block text-sm mb-1 text-gray-600"
              >
                Customer Name
              </label>
              <input
                id="customer_name"
                name="customer_name"
                type="text"
                value={form.customer_name}
                onChange={handleChange}
                className={inputBase}
                required
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="vendor_name"
                className="block text-sm mb-1 text-gray-600"
              >
                Vendor Name
              </label>
              <input
                id="vendor_name"
                name="vendor_name"
                type="text"
                value={form.vendor_name}
                onChange={handleChange}
                className={inputBase}
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="phone_no"
              className="block text-sm mb-1 text-gray-600"
            >
              Phone Number
            </label>
            <input
              id="phone_no"
              name="phone_no"
              type="text"
              value={form.phone_no}
              onChange={handleChange}
              className={inputBase}
              required
            />
          </div>
          <div>
            <label
              htmlFor="transaction_date"
              className="block text-sm mb-1 text-gray-600"
            >
              Transaction Date
            </label>
            <input
              id="transaction_date"
              name="transaction_date"
              type="date"
              value={form.transaction_date}
              onChange={handleChange}
              className={inputBase}
              required
            />
          </div>
          <div>
            <label
              htmlFor="payment_due_date"
              className="block text-sm mb-1 text-gray-600"
            >
              Payment Due Date
            </label>
            <input
              id="payment_due_date"
              name="payment_due_date"
              type="date"
              value={form.payment_due_date}
              onChange={handleChange}
              className={inputBase}
              required
            />
          </div>
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
            <div
              key={idx}
              className="grid md:grid-cols-4 gap-4 relative border p-4 rounded-lg bg-gray-50"
            >
              <div>
                <label className="block text-xs text-gray-600 mb-1 capitalize">
                  Product Name
                </label>
                <input
                  type="text"
                  name="product_name"
                  value={prod.product_name}
                  onChange={(e) => handleProductChange(idx, e)}
                  className={inputBase}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 capitalize">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={prod.quantity}
                  onChange={(e) => handleProductChange(idx, e)}
                  className={inputBase}
                  required
                  min={0}
                />
              </div>
              {isSale ? (
                <>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 capitalize">
                      Rate
                    </label>
                    <input
                      type="number"
                      name="rate"
                      value={prod.rate}
                      onChange={(e) => handleProductChange(idx, e)}
                      className={inputBase}
                      required
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 capitalize">
                      Total
                    </label>
                    <input
                      type="number"
                      name="sale_price"
                      value={prod.sale_price}
                      readOnly
                      className={inputBase + " bg-gray-100"}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 capitalize">
                      Purchase Price
                    </label>
                    <input
                      type="number"
                      name="price_purchase"
                      value={prod.price_purchase}
                      onChange={(e) => handleProductChange(idx, e)}
                      className={inputBase}
                      required
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 capitalize">
                      Selling Price
                    </label>
                    <input
                      type="number"
                      name="price_sale"
                      value={prod.price_sale}
                      onChange={(e) => handleProductChange(idx, e)}
                      className={inputBase}
                      required
                      min={0}
                    />
                  </div>
                </>
              )}
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

        <div className="flex justify-end items-center mt-4">
          <span className="text-lg font-semibold text-[#653239]">
            Total Bill Amount:&nbsp;
          </span>
          <span className="text-xl font-bold text-[#653239]">
            ₹ {totalAmount}
          </span>
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
            {isSale ? "Create Bill" : "Create Purchase"}
          </button>
        </div>
      </form>
    </div>
  );
}
