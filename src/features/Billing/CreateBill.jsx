import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createSale } from "../../api/salesApi";
import { createPurchase } from "../../api/purchaseApi";
import { getProducts } from "../../api/productApi";
import jsPDF from "jspdf";
import axios from "axios";

export default function CreateBill() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const fileInputRef = useRef();
  const [productSuggestions, setProductSuggestions] = useState([]);
  useEffect(() => {
    getProducts()
      .then((res) => {
        setProductSuggestions(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Failed to fetch product list", err));
  }, []);

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

    if (name === "product_name") {
      const matchedProduct = productSuggestions.find(
        (p) => p.product_name.toLowerCase() === value.toLowerCase()
      );
      if (matchedProduct) {
        updated[index].price_purchase = matchedProduct.price_purchase;
        updated[index].price_sale = matchedProduct.price_sale;
        updated[index].rate = isSale ? matchedProduct.price_sale : 0;
      }
    }

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

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true); // Show loader
    try {
      const res = await axios.post(
        "http://localhost:8000/api/extract-products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const detectedProducts = res.data.products || [];

      const filled = detectedProducts.map((p) => {
        const matchedProduct = productSuggestions.find(
          (ps) => ps.product_name.toLowerCase() === p.product_name.toLowerCase()
        );
        return {
          product_name: p.product_name,
          quantity: p.quantity,
          rate: isSale && matchedProduct ? matchedProduct.price_sale : 0,
          sale_price:
            isSale && matchedProduct
              ? p.quantity * matchedProduct.price_sale
              : 0,
          price_purchase: matchedProduct ? matchedProduct.price_purchase : 0,
          price_sale: matchedProduct ? matchedProduct.price_sale : 0,
        };
      });
      setForm((prev) => ({ ...prev, products: filled }));
    } catch (err) {
      console.error("Image extraction failed:", err);
    } finally {
      setUploading(false); // Hide loader
    }
  };

  const removeProduct = (index) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

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
    doc.setFontSize(16);
    doc.text(isSale ? "INVOICE" : "PURCHASE RECEIPT", 105, 18, {
      align: "center",
    });

    doc.setFontSize(11);
    let y = 30;
    if (isSale) {
      doc.text(`Customer: ${form.customer_name}`, 14, y);
    } else {
      doc.text(`Vendor: ${form.vendor_name}`, 14, y);
    }
    y += 7;
    doc.text(`Phone: ${form.phone_no}`, 14, y);
    y += 7;
    doc.text(`Date: ${form.transaction_date}`, 14, y);
    y += 7;
    doc.text(`Due: ${form.payment_due_date}`, 14, y);
    y += 10;

    const headers = isSale
      ? ["#", "Product", "Qty", "Rate", "Total"]
      : ["#", "Product", "Qty", "Purchase Price", "Selling Price", "Total"];
    let colX = [14, 34, 94, 114, 144, 174];
    headers.forEach((h, i) => {
      doc.setFont(undefined, "bold");
      doc.text(h, colX[i], y);
      doc.setFont(undefined, "normal");
    });
    y += 7;

    form.products.forEach((p, i) => {
      doc.text(String(i + 1), colX[0], y);
      doc.text(p.product_name, colX[1], y);
      doc.text(String(p.quantity), colX[2], y);
      if (isSale) {
        doc.text(String(p.rate), colX[3], y);
        doc.text(String(p.sale_price), colX[4], y);
      } else {
        doc.text(String(p.price_purchase), colX[3], y);
        doc.text(String(p.price_sale), colX[4], y);
        doc.text(String(p.quantity * p.price_purchase), colX[5], y);
      }
      y += 7;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 10;
    doc.setFont(undefined, "bold");
    doc.text(`Total Amount: ₹ ${totalAmount}`, isSale ? colX[3] : colX[4], y);
    doc.save(isSale ? "invoice.pdf" : "purchase.pdf");
  };

  const inputBase =
    "w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300";

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => setIsSale(true)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            isSale
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-green-800 hover:bg-green-100"
          }`}
        >
          Sale
        </button>
        <button
          type="button"
          onClick={() => setIsSale(false)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            !isSale
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-green-800 hover:bg-green-100"
          }`}
        >
          Purchase
        </button>
      </div>

      <h2 className="text-3xl font-bold text-green-700 mb-6">
        {isSale ? "Create Bill" : "Create Purchase"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {isSale ? (
            <div>
              <label
                htmlFor="customer_name"
                className="block text-sm font-medium text-gray-700 mb-1"
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
                className="block text-sm font-medium text-gray-700 mb-1"
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
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="block text-sm font-medium text-gray-700 mb-1"
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
            className="w-4 h-4 accent-green-600"
          />
          <span className="text-sm text-gray-800">Bill Paid</span>
        </label>
        <div className="flex items-center gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">
              Upload Bill Image (Optional)
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block text-sm text-gray-500 file:mr-4 file:py-1 file:px-2
        file:rounded-md file:border-0 file:text-sm file:font-semibold
        file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </label>

          {uploading && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <svg
                className="animate-spin h-4 w-4 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Processing...
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700">Products</h3>
          {form.products.map((prod, idx) => (
            <div
              key={idx}
              className="grid md:grid-cols-4 gap-4 relative border border-gray-200 p-4 rounded-lg bg-green-50/20"
            >
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Product Name
                </label>
                <input
                  name="product_name"
                  value={prod.product_name}
                  onChange={(e) => handleProductChange(idx, e)}
                  list={`product-list-${idx}`}
                  className={inputBase}
                  placeholder="Product Name"
                />
                <datalist id={`product-list-${idx}`}>
                  {productSuggestions.map((p, i) => (
                    <option key={i} value={p.product_name} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
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
                    <label className="block text-xs text-gray-600 mb-1">
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
                    <label className="block text-xs text-gray-600 mb-1">
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
                    <label className="block text-xs text-gray-600 mb-1">
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
                    <label className="block text-xs text-gray-600 mb-1">
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
                  className="absolute top-2 right-2 text-red-500 text-xs hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addProduct}
            className="px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            + Add Product
          </button>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-lg font-semibold text-green-800">
            Total: ₹ {totalAmount}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="py-3 px-5 rounded-md bg-green-700 text-white hover:bg-green-800 font-semibold"
            >
              Download PDF
            </button>
            <button
              type="submit"
              className="py-3 px-6 rounded-md bg-green-600 text-white hover:bg-green-700 font-semibold"
            >
              {isSale ? "Create Bill" : "Create Purchase"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
