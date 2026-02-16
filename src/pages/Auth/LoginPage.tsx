import React, { useState } from 'react';
import AuthLayout from '@/components/Layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    const handleLogin = async (e: React.FormEvent, type: 'citizen' | 'admin') => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const identifier = type === 'admin' ? email : mobile;
            const pass = type === 'admin' ? adminPassword : password;

            const response = await authService.login(identifier, pass);

            // Check role match
            if (response.user.role !== type) {
                toast.error(`Invalid account type. Please login as ${response.user.role}.`);
                setIsLoading(false);
                return;
            }

            login(response);
            toast.success(`Welcome back, ${response.user.name}`);

            if (type === 'admin') {
                navigate('/admin');
            } else {
                navigate('/track');
            }
        } catch (error: any) {
            toast.error(error.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your credentials to access your account"
        >
            <Tabs defaultValue="citizen" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="citizen">Citizen</TabsTrigger>
                    <TabsTrigger value="admin">Official / Admin</TabsTrigger>
                </TabsList>

                <TabsContent value="citizen">
                    <form onSubmit={(e) => handleLogin(e, 'citizen')} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input
                                id="mobile"
                                placeholder="+91 98765 43210"
                                required
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in as Citizen"}
                        </Button>
                    </form>
                </TabsContent>

                <TabsContent value="admin">
                    <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Official Email or ID</Label>
                            <Input
                                id="email"
                                placeholder="admin@village.gov.in"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-password">Password</Label>
                            <Input
                                id="admin-password"
                                type="password"
                                required
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" variant="secondary" type="submit" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in as Official"}
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>

            <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="underline underline-offset-4 hover:text-primary">
                    Sign up
                </Link>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
