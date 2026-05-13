import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Client/Home";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// Import StaffLayout mà chúng ta vừa tạo
import StaffLayout from "./components/StaffLayout/StaffLayout";

function App() {
  return (
    <>
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Home />} />

        {/* === STAFF ROUTES (Role: STAFF) === */}
        <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
          <Route path="/staff" element={<StaffLayout />}>
            {/* Chuyển hướng mặc định vào thẳng trang bán vé */}
            <Route
              index
              element={<Navigate to="/staff/sell-ticket" replace />}
            />

            {/* Dùng <div> tạm thời để không bị lỗi import, sau này tạo file thì thay vào */}
            <Route
              path="sell-ticket"
              element={
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h2 className="text-xl font-bold">
                    Màn hình Bán vé (Đang phát triển...)
                  </h2>
                </div>
              }
            />

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
