import { useEffect, useState } from 'react';
import { paymentAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/AdminLayout';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';
import { DollarSign, CreditCard, Loader2, TrendingUp } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        paymentAPI.getAll(),
        paymentAPI.getStats()
      ]);
      setPayments(paymentsRes.data.payments);
      setStats(statsRes.data.stats);
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <AdminPageHeader title="Payment Management" subtitle="Track all payments and revenue" />
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-3xl font-bold">${stats.totalRevenue?.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Today's Revenue</p>
                    <p className="text-3xl font-bold">${stats.todayRevenue?.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Monthly Revenue</p>
                    <p className="text-3xl font-bold">${stats.monthlyRevenue?.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : payments.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No payments yet"
                description="Transactions will appear here once users start paying for bookings."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Payment ID</th>
                      <th className="text-left py-3 px-4">User</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Method</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{payment.paymentId}</td>
                        <td className="py-3 px-4">{payment.user?.firstName} {payment.user?.lastName}</td>
                        <td className="py-3 px-4 font-semibold">${payment.amount}</td>
                        <td className="py-3 px-4 capitalize">{payment.paymentMethod}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusBadge(payment.status)}>
                            {payment.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
    </>
  );
};

export default AdminPayments;
