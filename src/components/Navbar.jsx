import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  FileText,
  HandCoins,
  ShoppingCart,
  Bell,
} from "lucide-react";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/billing", label: "Billing", icon: FileText },
  { to: "/udhaar/sales", label: "Sales Udhaar", icon: HandCoins },
  { to: "/udhaar/purchases", label: "Purchase Udhaar", icon: ShoppingCart },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="w-full bg-green-600/90 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-white tracking-tight">
          Smart Bill & Inventory
        </span>
      </div>
      <div className="hidden md:flex gap-2">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
              location.pathname.startsWith(to)
                ? "bg-white text-green-800"
                : "text-white hover:bg-green-700 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </div>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden p-2 rounded hover:bg-green-700/50 focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open navigation menu"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-green-600/95 shadow-lg flex flex-col z-50 md:hidden animate-fade-in">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-6 py-4 border-b font-medium ${
                location.pathname.startsWith(to)
                  ? "bg-white text-green-800"
                  : "text-white hover:bg-green-700 hover:text-white"
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
