import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import Profile from "./pages/Employee/Profile";
import Attendance from "./pages/Employee/Attendance";
import Leave from "./pages/Employee/Leave";
import Payroll from "./pages/Employee/Payroll";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Employees from "./pages/Admin/Employees";
import AdminAttendance from "./pages/Admin/AdminAttendance";
import AdminLeave from "./pages/Admin/AdminLeave";
import AdminPayroll from "./pages/Admin/AdminPayroll";
import Reports from "./pages/Admin/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center font-medium">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Employee Routes */}
            <Route path="/employee" element={
              <ProtectedRoute allowedRole="EMPLOYEE">
                <EmployeeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employee/profile" element={
              <ProtectedRoute allowedRole="EMPLOYEE">
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/employee/attendance" element={
              <ProtectedRoute allowedRole="EMPLOYEE">
                <Attendance />
              </ProtectedRoute>
            } />
            <Route path="/employee/leave" element={
              <ProtectedRoute allowedRole="EMPLOYEE">
                <Leave />
              </ProtectedRoute>
            } />
            <Route path="/employee/payroll" element={
              <ProtectedRoute allowedRole="EMPLOYEE">
                <Payroll />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/employees" element={
              <ProtectedRoute allowedRole="ADMIN">
                <Employees />
              </ProtectedRoute>
            } />
            <Route path="/admin/attendance" element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminAttendance />
              </ProtectedRoute>
            } />
            <Route path="/admin/leave" element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminLeave />
              </ProtectedRoute>
            } />
            <Route path="/admin/payroll" element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminPayroll />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRole="ADMIN">
                <Reports />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
