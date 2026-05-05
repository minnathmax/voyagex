import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Plane, Loader2, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsLoading(true);
    try {
      await authAPI.forgotPassword({ email: values.email });
      setIsSubmitted(true);
      toast.success('Password reset link sent to your email.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VoyageX
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              {isSubmitted
                ? 'Check your email for a link to reset your password.'
                : 'Enter your email address and we will send you a reset link.'}
            </CardDescription>
          </CardHeader>

          {!isSubmitted ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            autoComplete="email"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          ) : (
            <CardFooter className="flex flex-col gap-4 mt-4">
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
                Try another email
              </Button>
            </CardFooter>
          )}
        </Card>

        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
