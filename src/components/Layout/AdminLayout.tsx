import React from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50/50 flex">
            <AdminSidebar />
            <main className="flex-1 overflow-x-hidden">
                <div className="h-full p-4 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
