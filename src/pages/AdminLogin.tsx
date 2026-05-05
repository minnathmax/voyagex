import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Shield, Eye, EyeOff, Loader2, Lock } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await adminLogin(formData.email, formData.password);
      toast.success('Admin login successful!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Admin login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">VoyageX</span>
              <span className="block text-xs text-gray-400">Admin Portal</span>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Authorized personnel only
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@voyagex.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800 text-center">
                  <strong>Demo Credentials:</strong><br />
                  Email: admin@voyagex.com<br />
                  Password: admin123
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center mt-6 text-sm text-gray-400">
          Not an admin?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            User Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
