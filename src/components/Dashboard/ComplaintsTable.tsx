import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, ArrowUpDown, Search, Filter, Loader2 } from 'lucide-react';
import { complaintService, Complaint } from '@/services/complaintService';
import { toast } from 'sonner';

const ComplaintsTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchComplaints = async () => {
        setIsLoading(true);
        try {
            const data = await complaintService.getAllComplaints();
            setComplaints(data);
        } catch (error) {
            toast.error("Failed to load complaints");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
        const intervalId = setInterval(fetchComplaints, 5000); // Poll every 5 seconds
        return () => clearInterval(intervalId);
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: Complaint['status']) => {
        try {
            await complaintService.updateStatus(id, newStatus);
            toast.success(`Status updated to ${newStatus}`);
            fetchComplaints(); // Refresh
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredData = complaints.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
            case 'verified': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            case 'resolved': return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'critical': return 'bg-red-100 text-red-800 hover:bg-red-200';
            default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search complaints..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-[250px] lg:w-[350px]"
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={fetchComplaints}>
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No complaints found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((complaint) => (
                                <TableRow key={complaint.id}>
                                    <TableCell className="font-medium">{complaint.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{complaint.title}</span>
                                            <span className="text-xs text-muted-foreground">by {complaint.userName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{complaint.type}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(complaint.status)} variant="outline">
                                            {complaint.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(complaint.priority === 'critical' || complaint.priority === 'high' ? 'critical' : 'default')} variant="secondary">
                                            {complaint.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(complaint.id)}>
                                                    Copy ID
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(complaint.id, 'in-progress')}>
                                                    Mark In-Progress
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(complaint.id, 'resolved')}>
                                                    Mark Resolved
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(complaint.id, 'verified')}>
                                                    Verify & Close
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ComplaintsTable;
