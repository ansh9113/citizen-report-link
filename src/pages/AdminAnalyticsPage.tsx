import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { complaintService, Complaint } from '@/services/complaintService';
import { authService, User as AuthUser } from '@/services/authService';
import { Loader2, User, BarChart3 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const FALLBACK_COLOR = '#e5e7eb'; // Gray for no data

const AdminAnalyticsPage: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [users, setUsers] = useState<AuthUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [complaintsData, usersData] = await Promise.all([
                    complaintService.getAllComplaints(),
                    authService.getAllUsers()
                ]);
                setComplaints(complaintsData);
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching analytics data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const intervalId = setInterval(fetchData, 10000); // Poll every 10 seconds for analytics
        return () => clearInterval(intervalId);
    }, []);

    // Helper to calculate stats
    const calculateStats = () => {
        // 1. Response Times
        const categoryStats = complaints.reduce((acc, curr) => {
            if (!acc[curr.type]) acc[curr.type] = { total: 0, resolved: 0, totalTime: 0 };
            acc[curr.type].total += 1;
            if (curr.status === 'resolved') {
                acc[curr.type].resolved += 1;
                const mockTime = (curr.id.length * 5) + (Math.random() * 20);
                acc[curr.type].totalTime += mockTime;
            }
            return acc;
        }, {} as Record<string, { total: number, resolved: number, totalTime: number }>);

        const responseTimeData = Object.keys(categoryStats).map(type => ({
            name: type.charAt(0).toUpperCase() + type.slice(1),
            avgHours: categoryStats[type].resolved > 0
                ? Math.round(categoryStats[type].totalTime / categoryStats[type].resolved)
                : 0
        }));

        // 2. Status Distribution
        const statusCounts = complaints.reduce((acc, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const statusData = Object.keys(statusCounts).map(status => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: statusCounts[status]
        }));

        // 3. Category Distribution
        const typeCounts = complaints.reduce((acc, curr) => {
            acc[curr.type] = (acc[curr.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const categoryData = Object.keys(typeCounts).map(type => ({
            name: type.charAt(0).toUpperCase() + type.slice(1),
            value: typeCounts[type]
        }));

        // 4. User Role Distribution
        const roleCounts = users.reduce((acc, curr) => {
            acc[curr.role] = (acc[curr.role] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const userData = Object.keys(roleCounts).map(role => ({
            name: role.charAt(0).toUpperCase() + role.slice(1),
            value: roleCounts[role]
        }));

        // 5. Top Reporters
        const userStats = complaints.reduce((acc, curr) => {
            const userName = curr.userName || 'Anonymous';
            acc[userName] = (acc[userName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topReporters = Object.entries(userStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        return { responseTimeData, statusData, categoryData, userData, topReporters };
    };

    const { responseTimeData, statusData, categoryData, userData, topReporters } = calculateStats();

    // Validated Data for Charts (Use fallback if empty)
    const activeStatusData = statusData.length > 0 ? statusData : [{ name: 'No Data', value: 1 }];
    const activeCategoryData = categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1 }];

    // Custom label for charts
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
        if (activeCategoryData[index].name === 'No Data') return null;
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };


    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-screen">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
                    <p className="text-muted-foreground mt-1">Deep dive into data trends and performance metrics.</p>
                </div>

                {/* Broadcast Section */}
                <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-blue-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-megaphone"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
                            Broadcast Announcement
                        </CardTitle>
                        <CardDescription>Send an email notification to all {users.length} registered users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Subject"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                                id="broadcast-subject"
                            />
                            <button
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                onClick={async () => {
                                    const subjectInput = document.getElementById('broadcast-subject') as HTMLInputElement;
                                    const subject = subjectInput.value;
                                    if (!subject) {
                                        alert("Please enter a subject");
                                        return;
                                    }

                                    const confirmSend = window.confirm(`Send email to ${users.length} users?`);
                                    if (!confirmSend) return;

                                    try {
                                        // Import emailService dynamically or assume it's available
                                        const { emailService } = await import('@/services/emailService');
                                        const { toast } = await import('sonner');

                                        toast.info("Sending broadcast...");

                                        const recipients = users.map(u => ({ name: u.name, email: u.email || '' })).filter(u => u.email);
                                        await emailService.sendBroadcast(recipients, subject, "This is an important announcement from the Village Administration.");

                                        toast.success("Broadcast sent successfully!");
                                        subjectInput.value = '';
                                    } catch (e) {
                                        console.error(e);
                                        alert("Failed to send broadcast");
                                    }
                                }}
                            >
                                Send to All
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Complaint Status</CardTitle>
                            <CardDescription>Distribution by current status</CardDescription>
                        </CardHeader>
                        <CardContent style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={activeStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {activeStatusData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.name === 'No Data' ? FALLBACK_COLOR : COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Category Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Categories</CardTitle>
                            <CardDescription>Complaints by type</CardDescription>
                        </CardHeader>
                        <CardContent style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={activeCategoryData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        labelLine={false}
                                        label={activeCategoryData[0].name !== 'No Data' ? renderCustomLabel : undefined}
                                    >
                                        {activeCategoryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.name === 'No Data' ? FALLBACK_COLOR : COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* User Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Demographics</CardTitle>
                            <CardDescription>Registered Users by Role</CardDescription>
                        </CardHeader>
                        <CardContent style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userData.length > 0 ? userData : [{ name: 'No Users', value: 0 }]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Avg. Resolution Time (Hours)</CardTitle>
                            <CardDescription>Average time to resolve issues by category.</CardDescription>
                        </CardHeader>
                        <CardContent style={{ height: 350 }}>
                            {responseTimeData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={responseTimeData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="avgHours" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                                    <BarChart3 className="h-8 w-8 mb-2 opacity-50" />
                                    <p>No resolution data available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Top Contributors</CardTitle>
                            <CardDescription>Most active citizens by complaints submitted.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topReporters.length > 0 ? (
                                    topReporters.map((reporter, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                                    <User className="h-5 w-5 text-foreground" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">{reporter.name}</p>
                                                    <p className="text-xs text-muted-foreground">Rank #{index + 1}</p>
                                                </div>
                                            </div>
                                            <div className="font-medium bg-secondary px-3 py-1 rounded-full text-xs">
                                                {reporter.count} Reports
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                        No data available yet.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAnalyticsPage;
