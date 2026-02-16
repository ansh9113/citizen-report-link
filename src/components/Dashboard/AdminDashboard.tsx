import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Bell } from 'lucide-react';
import DashboardStats from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import ComplaintsTable from './ComplaintsTable';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const handleExportReport = () => {
    toast.success("Report Exported", {
      description: "Your report is being prepared for download",
    });
  };

  const handleSendNotifications = () => {
    toast.success("Notifications Sent", {
      description: "Status updates have been sent to all relevant parties",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of village citizen reports and resolution status.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportReport} className="shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSendNotifications} className="shadow-sm">
            <Bell className="h-4 w-4 mr-2" />
            Notify
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Recent Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardStats />
          <DashboardCharts />

          <Card className="col-span-4">
            <CardHeader className="px-6 py-4 border-b bg-muted/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Complaints</CardTitle>
                  <CardDescription>Latest complaints across all categories.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ComplaintsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <DashboardCharts />
          {/* Additional analytics could belong here */}
          <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            More detailed analytics modules coming soon.
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>Manage and track all citizen reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <ComplaintsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
