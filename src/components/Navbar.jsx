import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  FileText,
  HandCoins,
  ShoppingCart,
  Bell,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/billing", label: "Billing", icon: FileText },
  { to: "/udhaar/sales", label: "Sales on Udhaar", icon: HandCoins },
  { to: "/udhaar/purchases", label: "Purchases on Udhaar", icon: ShoppingCart },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="w-full bg-green-700 px-4 py-3 flex items-center justify-between shadow">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-xl font-bold text-white tracking-tight">
          BillDeck
        </Link>
      </div>

      {/* Dashboard Shortcut (Mobile) */}
      <Link
        to="/dashboard"
        className="md:hidden flex items-center gap-2 px-3 py-2 text-sm bg-white text-green-700 rounded-lg font-semibold shadow hover:bg-green-50"
      >
        <LayoutDashboard size={16} /> Dashboard
      </Link>

      {/* Full Navigation (Desktop) */}
      <div className="hidden md:flex gap-2">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-150 ${
              location.pathname.startsWith(to)
                ? "bg-white text-green-800"
                : "text-white hover:bg-green-600"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </div>

      {/* Hamburger (Mobile) */}
      <button
        className="md:hidden p-2 rounded hover:bg-green-800/30 focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* Mobile Dropdown */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-green-700 shadow-xl z-50 animate-fade-in-down md:hidden">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-6 py-4 border-b font-medium transition-colors ${
                location.pathname.startsWith(to)
                  ? "bg-white text-green-800"
                  : "text-white hover:bg-green-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}