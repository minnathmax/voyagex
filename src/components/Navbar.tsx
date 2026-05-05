import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Plane,
  Menu,
  Calendar,
  MapPin,
  Star,
  LogOut,
  Settings,
  Sparkles,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { VoyageXLogo } from './Logo';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '/destinations' },
  ];

  const userLinks = [
    { name: 'My Bookings', href: '/my-bookings', icon: Calendar },
    { name: 'My Itineraries', href: '/my-itineraries', icon: MapPin },
    { name: 'AI Recommendations', href: '/ai-recommendations', icon: Sparkles },
    { name: 'My Reviews', href: '/my-reviews', icon: Star },
    { name: 'Reports', href: '/reports', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <VoyageXLogo className="w-10 h-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              VoyageX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Link
                to="/itinerary-planner"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Plan Trip
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </div>
                      <span className="hidden sm:inline text-sm font-medium">
                        {user?.firstName}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {userLinks.map((link) => (
                      <DropdownMenuItem key={link.name} onClick={() => navigate(link.href)}>
                        <link.icon className="mr-2 h-4 w-4" />
                        {link.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    {user?.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin/dashboard')} className="text-blue-600 font-medium">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}

            <ThemeToggle />

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-gray-600 hover:text-gray-900"
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/itinerary-planner"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-blue-600 hover:text-blue-700"
                      >
                        Plan Trip
                      </Link>
                      <div className="border-t my-2" />
                      {userLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className="text-lg font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2"
                        >
                          <link.icon className="h-4 w-4" />
                          {link.name}
                        </Link>
                      ))}
                      <div className="border-t my-2" />
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="text-lg font-medium text-red-600 hover:text-red-700 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="border-t my-2" />
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-gray-600 hover:text-gray-900"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-blue-600 hover:text-blue-700"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
