import { ReactNode } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, LogOut, Bell } from 'lucide-react';
import Logo from '@/components/ui/Logo';

interface EmployeeLayoutProps {
  children: ReactNode;
}

const EmployeeLayout = ({ children }: EmployeeLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('profile')) return 'My Profile';
    if (path.includes('attendance')) return 'Attendance';
    if (path.includes('leave')) return 'Leave Management';
    if (path.includes('payroll')) return 'Payroll';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/employee">
              <Logo size="sm" />
            </Link>

            {/* Page Title - Center (hidden on mobile) */}
            <h1 className="hidden md:block text-lg font-semibold text-foreground">
              {getPageTitle()}
            </h1>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>

              {/* Profile */}
              <Link 
                to="/employee/profile"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Page Title */}
        <h1 className="md:hidden text-2xl font-bold text-foreground mb-6">
          {getPageTitle()}
        </h1>
        {children}
      </main>
    </div>
  );
};

export default EmployeeLayout;
