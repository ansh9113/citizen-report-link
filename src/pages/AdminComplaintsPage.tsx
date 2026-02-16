import React from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import ComplaintsTable from '@/components/Dashboard/ComplaintsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AdminComplaintsPage: React.FC = () => {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Complaints Management</h1>
                    <p className="text-muted-foreground mt-1">View, update, and resolve citizen complaints.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>All Complaints</CardTitle>
                        <CardDescription>Comprehensive list of all submitted issues.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ComplaintsTable />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminComplaintsPage;
