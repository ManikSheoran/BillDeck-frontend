import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InventoryList from "../features/Inventory/InventoryList";
import AddItem from "../features/Inventory/AddItem";
import CreateBill from "../features/Billing/CreateBill";
import AddPurchase from "../features/Purchase/AddPurchase";
import ViewSalesUdhaar from "../features/Udhaar/ViewSalesUdhaar";
import ViewPurchaseUdhaar from "../features/Udhaar/ViewPurchaseUdhaar";
import NotificationList from "../features/Notifications/NotificationList";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AppRoutes() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-4">
            <Routes>
              <Route path="/inventory" element={<InventoryList />} />
              <Route path="/inventory/add" element={<AddItem />} />
              <Route path="/billing" element={<CreateBill />} />
              <Route path="/purchase" element={<AddPurchase />} />
              <Route path="/udhaar/sales" element={<ViewSalesUdhaar />} />
              <Route
                path="/udhaar/purchases"
                element={<ViewPurchaseUdhaar />}
              />
              <Route path="/notifications" element={<NotificationList />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
