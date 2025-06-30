import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../api/productApi";

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
      <div className="p-6 text-center text-[#653239] font-medium">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#653239] mb-6">Inventory List</h2>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 uppercase tracking-wider">
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
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No products available.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.product_id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="border px-4 py-2">{product.product_id}</td>
                  <td className="border px-4 py-2">{product.product_name}</td>
                  <td className="border px-4 py-2">₹{product.price_purchase}</td>
                  <td className="border px-4 py-2">₹{product.price_sale}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(product.product_id)}
                      className="bg-[#653239] hover:bg-[#AF7A6D] text-white px-3 py-1 rounded text-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}