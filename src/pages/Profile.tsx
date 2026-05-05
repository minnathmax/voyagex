import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Loader2,
  Camera,
  Save
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.location?.city || '',
    country: user?.location?.country || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await authAPI.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        location: {
          city: profileData.city,
          country: profileData.country,
        },
      });
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-50">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <Badge className="mt-2 capitalize">{user?.role}</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="City"
                          value={profileData.city}
                          onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                        />
                        <Input
                          placeholder="Country"
                          value={profileData.country}
                          onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleProfileUpdate}
                      disabled={isUpdating}
                      className="gap-2"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Change Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                    </div>

                    <Button 
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                      className="gap-2"
                    >
                      {isChangingPassword ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                      Change Password
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
