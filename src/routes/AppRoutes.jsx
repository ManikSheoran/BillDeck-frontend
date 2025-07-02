import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Lazy-loaded route components
const InventoryList = lazy(() => import("../features/Inventory/InventoryList"));
const CreateBill = lazy(() => import("../features/Billing/CreateBill"));
const AddPurchase = lazy(() => import("../features/Purchase/AddPurchase"));
const ViewSalesUdhaar = lazy(() =>
  import("../features/Udhaar/ViewSalesUdhaar")
);
const ViewPurchaseUdhaar = lazy(() =>
  import("../features/Udhaar/ViewPurchaseUdhaar")
);
const NotificationList = lazy(() =>
  import("../features/Notifications/NotificationList")
);
const SaleDetails = lazy(() => import("../pages/SaleDetails"));
const PurchaseDetails = lazy(() => import("../pages/PurchaseDetails"));
const NotFound = () => (
  <div className="text-center text-gray-500 mt-20 text-xl">
    404 – Page Not Found
  </div>
);

export default function AppRoutes() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="hidden sm:flex w-64 bg-white border-r border-gray-100 shadow-sm p-6">
          <Sidebar />
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <header className="w-256 sticky top-0 z-10 bg-white shadow-sm ">
            <Navbar />
          </header>

          <main className="flex-1 overflow-x-auto p-4 sm:p-6">
            <Suspense
              fallback={<div className="text-gray-400 mt-10">Loading...</div>}
            >
              <Routes>
                <Route path="/" element={<Navigate to="/inventory" />} />
                <Route path="/inventory" element={<InventoryList />} />
                <Route path="/billing" element={<CreateBill />} />
                <Route path="/purchase" element={<AddPurchase />} />
                <Route path="/udhaar/sales" element={<ViewSalesUdhaar />} />
                <Route
                  path="/udhaar/purchases"
                  element={<ViewPurchaseUdhaar />}
                />
                <Route path="/notifications" element={<NotificationList />} />
                <Route path="/sale/:saleId" element={<SaleDetails />} />
                <Route
                  path="/purchase/:purchaseId"
                  element={<PurchaseDetails />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </Router>
  );
}
