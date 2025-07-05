import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../api/productApi";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InventoryList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-emerald-700 font-medium animate-pulse">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-emerald-700 mb-4"
      >
        Inventory List
      </motion.h2>

      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-emerald-100 text-emerald-800 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">Product Name</th>
                <th className="px-4 py-3 border">Purchase Price</th>
                <th className="px-4 py-3 border">Sale Price</th>
                <th className="px-4 py-3 border">Quantity</th>
                <th className="px-4 py-3 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-500">
                      No products available.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <motion.tr
                      key={product.product_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-emerald-50 transition"
                    >
                      <td className="border px-4 py-2">{product.product_id}</td>
                      <td className="border px-4 py-2">
                        {product.product_name}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{product.price_purchase}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{product.price_sale}
                      </td>
                      <td className="border px-4 py-2">{product.quantity}</td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(product.product_id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded flex items-center gap-1 mx-auto"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
