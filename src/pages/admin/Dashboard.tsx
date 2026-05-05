import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '@/services/api';
import type { DashboardStats } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/AdminLayout';
import { toast } from 'sonner';
import { 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  AlertCircle,
  Loader2,
  ArrowRight,
  BarChart3,
  UserPlus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockRevenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 6890 },
  { name: 'Sat', revenue: 8390 },
  { name: 'Sun', revenue: 7490 },
];

const mockCategoryData = [
  { name: 'Beach', bookings: 45 },
  { name: 'Mountain', bookings: 30 },
  { name: 'City', bookings: 65 },
  { name: 'Adventure', bookings: 25 },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.stats);
      setRecentUsers(response.data.recent.users);
      setRecentBookings(response.data.recent.bookings);
      setPopularDestinations(response.data.popularDestinations);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users.total || 0,
      active: stats?.users.active || 0,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      title: 'Destinations',
      value: stats?.destinations.total || 0,
      active: stats?.destinations.active || 0,
      icon: MapPin,
      color: 'bg-green-500',
      link: '/admin/destinations',
    },
    {
      title: 'Bookings',
      value: stats?.bookings.total || 0,
      pending: stats?.bookings.pending || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/admin/bookings',
    },
    {
      title: 'Revenue',
      value: `$${(stats?.revenue.total || 0).toLocaleString()}`,
      monthly: `$${(stats?.revenue.monthly || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-orange-500',
      link: '/admin/payments',
    },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" subtitle="Overview of your platform at a glance" />
      {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <Link key={card.title} to={card.link}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                      <p className="text-3xl font-bold">{card.value}</p>
                      {'active' in card && (
                        <p className="text-sm text-green-600 mt-1">
                          {card.active} active
                        </p>
                      )}
                      {'pending' in card && (
                        <p className="text-sm text-yellow-600 mt-1">
                          {card.pending} pending
                        </p>
                      )}
                      {'monthly' in card && (
                        <p className="text-sm text-blue-600 mt-1">
                          {card.monthly} this month
                        </p>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Revenue (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} tickFormatter={(value) => `$${value}`} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Bookings by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="bookings" fill="#9333ea" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Bookings
                </CardTitle>
                <Link to="/admin/bookings">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent bookings</p>
                  ) : (
                    recentBookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {booking.user?.firstName?.[0]}{booking.user?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{booking.user?.firstName} {booking.user?.lastName}</p>
                            <p className="text-sm text-gray-500">{booking.destination?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${booking.totalAmount}</p>
                          <Badge 
                            variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  New Users
                </CardTitle>
                <Link to="/admin/users">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent users</p>
                  ) : (
                    recentUsers.slice(0, 5).map((user) => (
                      <div key={user._id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Badge variant={user.isActive ? 'default' : 'secondary'} className="text-xs">
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Popular Destinations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Popular Destinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularDestinations.slice(0, 5).map((dest, idx) => (
                    <div key={dest._id} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{dest.name}</p>
                        <p className="text-xs text-gray-500">{dest.visitCount} visits</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{Number(dest.rating.average).toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Attention Needed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm">Pending Bookings</span>
                    <Badge variant="secondary">{stats?.bookings.pending || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm">Open Reports</span>
                    <Badge variant="destructive">{stats?.openReports || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm">Total Reviews</span>
                    <Badge variant="default">{stats?.reviews || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </>
  );
};

export default AdminDashboard;
