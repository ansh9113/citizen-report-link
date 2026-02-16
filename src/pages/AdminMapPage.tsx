import React from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import ComplaintMap from '@/components/Map/ComplaintMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminMapPage: React.FC = () => {
    // Mock data for map
    const markers = [
        { id: '1', lat: 20.5937, lng: 78.9629, title: 'Test Issue', description: 'Test Description', status: 'submitted' as const },
        { id: '2', lat: 19.0760, lng: 72.8777, title: 'Mumbai Road', description: 'Pothole', status: 'submitted' as const },
        { id: '3', lat: 28.7041, lng: 77.1025, title: 'Delhi Water', description: 'No Supply', status: 'resolved' as const },
        { id: '4', lat: 12.9716, lng: 77.5946, title: 'Bangalore Light', description: 'Broken', status: 'in-progress' as const },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Geographic Overview</h1>
                    <p className="text-muted-foreground mt-1">Spatial distribution of reported issues.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Live Incident Map</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ComplaintMap markers={markers} height="600px" />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminMapPage;
