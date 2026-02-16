import React, { useState } from 'react';
import AuthLayout from '@/components/Layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from '@/services/authService';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Citizen Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');

    // Admin Form State
    const [deptId, setDeptId] = useState('');
    const [email, setEmail] = useState('');
    const [designation, setDesignation] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');

    const handleRegister = async (e: React.FormEvent, type: 'citizen' | 'admin') => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (type === 'admin' && accessCode !== 'ADMIN123') {
                throw new Error("Invalid Access Code. Please contact your supervisor.");
            }

            const userData = type === 'citizen' ? {
                name: `${firstName} ${lastName}`,
                mobile,
                address,
                password,
                role: 'citizen' as const
            } : {
                name: email.split('@')[0], // derived name
                email,
                department: deptId,
                designation,
                password: adminPassword,
                role: 'admin' as const
            };

            await authService.register(userData);

            toast.success("Account created successfully!");
            navigate('/login');
        } catch (error: any) {
            toast.error(error.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Join the platform to report issues and improve your community"
        >
            <Tabs defaultValue="citizen" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="citizen">Citizen</TabsTrigger>
                    <TabsTrigger value="admin">Official / Admin</TabsTrigger>
                </TabsList>

                <TabsContent value="citizen">
                    <form onSubmit={(e) => handleRegister(e, 'citizen')} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
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
                            <Label htmlFor="address">Village / Area</Label>
                            <Input
                                id="address"
                                placeholder="Sector 4"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
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
                        <div className="items-top flex space-x-2">
                            <Checkbox id="terms1" required />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="terms1"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Accept terms and conditions
                                </label>
                            </div>
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Create Citizen Account"}
                        </Button>
                    </form>
                </TabsContent>

                <TabsContent value="admin">
                    <form onSubmit={(e) => handleRegister(e, 'admin')} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="dept-id">Department ID</Label>
                            <Input
                                id="dept-id"
                                placeholder="DEPT-001"
                                required
                                value={deptId}
                                onChange={(e) => setDeptId(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Official Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@gov.in"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="designation">Designation</Label>
                            <Input
                                id="designation"
                                placeholder="Junior Engineer"
                                required
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-pass">Password</Label>
                            <Input
                                id="admin-pass"
                                type="password"
                                required
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-code">Access Code</Label>
                            <Input
                                id="admin-code"
                                type="password"
                                placeholder="Provided by Supervisor (Use: ADMIN123)"
                                required
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" variant="secondary" type="submit" disabled={isLoading}>
                            {isLoading ? "Requesting access..." : "Request Official Access"}
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                    Sign in
                </Link>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
