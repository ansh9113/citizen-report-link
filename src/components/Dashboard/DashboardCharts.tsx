import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { complaintService, Complaint } from '@/services/complaintService';
import { Loader2 } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

export const DashboardCharts: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await complaintService.getAllComplaints();
                setComplaints(data);
            } catch (error) {
                console.error("Failed to load chart data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Process Status Data
    const statusCounts = complaints.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieChartData = Object.keys(statusCounts).map(status => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: statusCounts[status]
    }));

    // Process Trend Data (Group by Month)
    const trendData = complaints.reduce((acc, curr) => {
        const date = new Date(curr.createdAt);
        const month = date.toLocaleString('default', { month: 'short' });

        const existing = acc.find(item => item.name === month);
        if (existing) {
            existing.total += 1;
        } else {
            acc.push({ name: month, total: 1 });
        }
        return acc;
    }, [] as { name: string, total: number }[]);

    // Sort logic could represent real timeline, for now simulated 'order' is fine or just reverse if needed.
    // Ensure we have at least some dummy data if empty to show empty chart state nicely
    const finalTrendData = trendData.length > 0 ? trendData : [{ name: 'Today', total: 0 }];


    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Complaint Trends</CardTitle>
                    <CardDescription>
                        Submission volume over time
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={finalTrendData}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                                allowDecimals={false}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Status Distribution</CardTitle>
                    <CardDescription>
                        Current status of all active complaints
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={pieChartData.length > 0 ? pieChartData : [{ name: 'No Data', value: 1 }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieChartData.length > 0 ? pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                )) : <Cell fill="#e5e7eb" />}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};
