import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Client/Home";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import SellTicketWizard from "./pages/Staff/SellTicket/SellTicketWizard";
import StaffLayout from "./components/StaffLayout/StaffLayout";
import CheckIn from "./pages/Staff/Checkin";
import Dashboard from "./pages/Staff/dashboard";
import Profile from "./pages/Staff/Profile/Profile";

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
            <Route path="check-in" element={<CheckIn />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
