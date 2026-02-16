import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { complaintService } from '@/services/complaintService';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, trend, trendValue }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <div className="h-4 w-4 text-muted-foreground">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {trend === 'up' && <span className="text-green-500 font-medium">↑ {trendValue}</span>}
                    {trend === 'down' && <span className="text-red-500 font-medium">↓ {trendValue}</span>}
                    {trend === 'neutral' && <span className="text-yellow-500 font-medium">→ {trendValue}</span>}
                    {' '}{description}
                </p>
            </CardContent>
        </Card>
    );
};

const DashboardStats: React.FC = () => {
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        pending: 0,
        critical: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await complaintService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Complaints"
                value={stats.total}
                icon={<AlertCircle className="h-4 w-4" />}
                description="All time"
                trend="up"
                trendValue="Live"
            />
            <StatCard
                title="Pending Action"
                value={stats.pending}
                icon={<Clock className="h-4 w-4" />}
                description="Submitted & In Progress"
                trend="neutral"
                trendValue="Active"
            />
            <StatCard
                title="Resolved Issues"
                value={stats.resolved}
                icon={<CheckCircle className="h-4 w-4" />}
                description="Successfully closed"
                trend="up"
                trendValue="Success"
            />
            <StatCard
                title="Critical Priority"
                value={stats.critical}
                icon={<TrendingUp className="h-4 w-4" />}
                description="Needs immediate attention"
                trend="down"
                trendValue="Priority"
            />
        </div>
    );
};

export default DashboardStats;
