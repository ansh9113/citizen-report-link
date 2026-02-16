import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    Map,
    BarChart3,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

interface SidebarProps {
    className?: string;
}

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: FileText, label: 'Complaints', href: '/admin/complaints' },
    { icon: Map, label: 'Map View', href: '/admin/map' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

const AdminSidebar: React.FC<SidebarProps> = ({ className }) => {
    const location = useLocation();

    // Helper to determine if a route is active
    // Handles exact match for root /admin and sub-routes for others
    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-card border-r">
            <div className="p-6 flex items-center justify-center border-b">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                        CR
                    </div>
                    <span>AdminPanel</span>
                </div>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Menu
                </div>

                {sidebarItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive: routerActive }) => {
                            // We use our custom logic or router logic, but since we are handling sub-routes manually in isActive
                            // and navlink handles it too, let's stick to simple NavLink logic if it works, 
                            // but standard isActive might be tricky with "end" prop. 
                            // Let's use simple conditional class application relative to current path.
                            const active = isActive(item.href);
                            return cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                active
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            );
                        }}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-50" onClick={() => alert("Logout functionality")}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={cn("hidden md:block w-64 h-screen sticky top-0", className)}>
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};

export default AdminSidebar;
