import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-48 min-h-screen bg-gray-800 text-white p-4 space-y-2">
      <h2 className="text-lg font-bold mb-4">Menu</h2>
      <nav className="space-y-2">
        <Link to="/inventory" className="block hover:text-yellow-400">
          Inventory List
        </Link>
        <Link to="/inventory/add" className="block hover:text-yellow-400">
          Add Item
        </Link>
        <Link to="/billing" className="block hover:text-yellow-400">
          Create Bill
        </Link>
        <Link to="/purchase" className="block hover:text-yellow-400">
          Add Purchase
        </Link>
        <Link to="/udhaar/sales" className="block hover:text-yellow-400">
          Sales Udhaar
        </Link>
        <Link to="/udhaar/purchases" className="block hover:text-yellow-400">
          Purchase Udhaar
        </Link>
        <Link to="/notifications" className="block hover:text-yellow-400">
          Notifications
        </Link>
      </nav>
    </div>
  );
}
