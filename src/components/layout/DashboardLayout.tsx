import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  User,
  Calendar,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: ReactNode;
}

const employeeNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: User, label: 'My Profile', path: '/profile' },
  { icon: Clock, label: 'Attendance', path: '/attendance' },
  { icon: Calendar, label: 'Leave', path: '/leave' },
  { icon: DollarSign, label: 'Payroll', path: '/payroll' },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Employees', path: '/employees' },
  { icon: Clock, label: 'Attendance', path: '/attendance' },
  { icon: CheckCircle, label: 'Approvals', path: '/approvals' },
  { icon: DollarSign, label: 'Payroll', path: '/payroll' },
  { icon: User, label: 'My Profile', path: '/profile' },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.role === 'admin' ? adminNavItems : employeeNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden glass-card p-2 rounded-xl"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: (isMobile && !sidebarOpen) ? -300 : 0 }}
        className={cn(
          "fixed top-0 left-0 h-full w-64 glass-card border-r z-40 p-5 flex flex-col lg:translate-x-0"
        )}
      >
        <Link to="/" className="flex items-center mb-8 -ml-3">
          <img src="/full_logo.png" alt="Dayflow" className="h-16 w-auto object-contain" />
        </Link>

        {/* Profile Card */}
        <div className="mb-6 p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center ring-2 ring-primary/20">
              <span className="text-primary-foreground font-bold text-lg">
                {(user?.name === 'User' ? user?.email?.charAt(0) : user?.name?.charAt(0)) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{(user?.name === 'User' ? user?.email?.split('@')[0] : user?.name) || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || 'Member'}</p>
            </div>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="truncate">{user?.email || ''}</p>

          </div>
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Menu</p>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
                    isActive
                      ? "gradient-primary text-primary-foreground shadow-md"
                      : "hover:bg-secondary text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive text-sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen p-4 lg:p-8 lg:pl-6 pt-20 lg:pt-10 text-left">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
