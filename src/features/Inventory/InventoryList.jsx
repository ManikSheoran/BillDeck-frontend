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

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory List</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="text-center">
              <td className="border p-2">{product.id}</td>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.quantity}</td>
              <td className="border p-2">{product.price}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
                {/* Optional: Add Edit button later */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
