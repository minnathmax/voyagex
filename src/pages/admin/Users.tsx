import { useEffect, useState } from 'react';
import { adminAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/AdminLayout';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';
import { 
  Search, 
  Loader2, 
  UserX, 
  UserCheck, 
  Trash2,
  Users as UsersIcon,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<'block' | 'unblock' | 'delete' | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedUser || !actionDialog) return;

    try {
      switch (actionDialog) {
        case 'block':
          await adminAPI.blockUser(selectedUser._id);
          toast.success('User blocked successfully');
          break;
        case 'unblock':
          await adminAPI.unblockUser(selectedUser._id);
          toast.success('User unblocked successfully');
          break;
        case 'delete':
          await adminAPI.deleteUser(selectedUser._id);
          toast.success('User deleted successfully');
          break;
      }
      fetchUsers();
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setActionDialog(null);
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AdminPageHeader title="User Management" subtitle="Manage user accounts" />
        <Card>
          <CardContent className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <EmptyState
                icon={UsersIcon}
                title={searchQuery ? 'No users match your search' : 'No users yet'}
                description={searchQuery ? 'Try a different keyword.' : 'Users will appear here once people sign up.'}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">User</th>
                      <th className="text-left py-3 px-4">Contact</th>
                      <th className="text-left py-3 px-4">Location</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Joined</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {user.firstName[0]}{user.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p className="flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {user.email}
                            </p>
                            <p className="flex items-center gap-1 text-gray-500">
                              <Phone className="h-3 w-3" /> {user.phone}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {user.location?.city || 'N/A'}, {user.location?.country || 'N/A'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={user.isActive ? 'default' : 'secondary'}
                            className={user.isBlocked ? 'bg-red-100 text-red-800' : ''}
                          >
                            {user.isBlocked ? 'Blocked' : user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {user.isBlocked ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionDialog('unblock');
                                }}
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionDialog('block');
                                }}
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedUser(user);
                                setActionDialog('delete');
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      {/* Action Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog === 'block' && 'Block User'}
              {actionDialog === 'unblock' && 'Unblock User'}
              {actionDialog === 'delete' && 'Delete User'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog === 'block' && 'Are you sure you want to block this user? They will not be able to access their account.'}
              {actionDialog === 'unblock' && 'Are you sure you want to unblock this user? They will regain access to their account.'}
              {actionDialog === 'delete' && 'Are you sure you want to delete this user? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button 
              variant={actionDialog === 'delete' ? 'destructive' : 'default'}
              onClick={handleAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsers;
