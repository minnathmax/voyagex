import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { VoyageXLogo } from './Logo';

const adminNav = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Destinations', href: '/admin/destinations' },
  { name: 'Bookings', href: '/admin/bookings' },
  { name: 'Payments', href: '/admin/payments' },
  { name: 'Reviews', href: '/admin/reviews' },
  { name: 'Reports', href: '/admin/reports' },
];

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const AdminPageHeader = ({ title, subtitle, actions }: AdminPageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/admin" className="flex items-center gap-2 group">
              <VoyageXLogo className="w-8 h-8" />
              <div className="leading-tight">
                <p className="text-base font-bold">VoyageX Admin</p>
                <p className="hidden sm:block text-xs text-gray-500">
                  {user ? `Signed in as ${user.firstName} ${user.lastName}` : 'Administration'}
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="outline" size="sm">View Site</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="text-red-600 hover:text-red-700">
                <LogOut className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {adminNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
