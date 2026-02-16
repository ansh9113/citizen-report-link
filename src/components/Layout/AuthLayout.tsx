import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Content/Form Area */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-background relative">
                <Button
                    variant="ghost"
                    className="absolute top-8 left-8"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </Button>

                <div className="mx-auto w-full max-w-sm space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>

            {/* Right: Decorative Image/Gradient */}
            <div className="hidden lg:block relative bg-muted">
                <div className="absolute inset-0 bg-primary/10 bg-[url('https://images.unsplash.com/photo-1542601906990-24d4c16419d4?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/0" />
                <div className="absolute bottom-16 left-16 max-w-md space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                        CR
                    </div>
                    <blockquote className="text-lg font-medium">
                        "Empowering citizens to build better communities together. Report issues, track progress, and see the change."
                    </blockquote>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
