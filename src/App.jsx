import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Client/Home";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import SellTicketWizard from "./pages/Staff/SellTicket/SellTicketWizard";
import StaffLayout from "./components/StaffLayout/StaffLayout";
import Dashboard from "./pages/Staff/dashboard";

function App() {
  return (
    <>
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Home />} />

        {/* === STAFF ROUTES (Role: STAFF) === */}
        <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
          <Route path="/staff" element={<StaffLayout />}>
            {/* Chuyển hướng mặc định vào thẳng trang dashboard */}
            <Route index element={<Navigate to="/staff/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sell-ticket" element={<SellTicketWizard />} />
            <Route
              path="check-in"
              element={
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h2 className="text-xl font-bold">
                    Màn hình Soát vé (Đang phát triển...)
                  </h2>
                </div>
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
