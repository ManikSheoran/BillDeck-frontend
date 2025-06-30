import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-8 text-[#653239] tracking-tight">
        Bill Deck
      </h2>
      <nav className="flex flex-col gap-2">
        <SidebarLink to="/inventory">Inventory List</SidebarLink>
        <SidebarLink to="/inventory/add">Add Item</SidebarLink>
        <SidebarLink to="/billing">Create Bill</SidebarLink>
        <SidebarLink to="/purchase">Add Purchase</SidebarLink>
        <SidebarLink to="/udhaar/sales">Sales Udhaar</SidebarLink>
        <SidebarLink to="/udhaar/purchases">Purchase Udhaar</SidebarLink>
        <SidebarLink to="/notifications">Notifications</SidebarLink>
      </nav>
    </>
  );
}

// eslint-disable-next-line react/prop-types
function SidebarLink({ to, children }) {
  return (
    <Link
      to={to}
      className="px-4 py-2 rounded-lg text-[#653239] font-medium hover:bg-[#EAF9D9] hover:text-[#AF7A6D] transition-colors"
    >
      {children}
    </Link>
  );
}
