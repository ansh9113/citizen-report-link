
export interface Complaint {
    id: string;
    userId: string; // Link to the user who reported it
    userName: string;
    type: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'submitted' | 'in-progress' | 'resolved' | 'verified';
    location?: {
        lat: number;
        lng: number;
        address?: string;
    };
    photos?: string[]; // Store as Base64 for demo
    createdAt: string;
    updatedAt: string;
}

const COMPLAINTS_KEY = 'cr_complaints';
const DELAY = 600;

const getComplaints = (): Complaint[] => {
    const data = localStorage.getItem(COMPLAINTS_KEY);
    return data ? JSON.parse(data) : [];
};

const saveComplaints = (data: Complaint[]) => {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(data));
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const complaintService = {
    // CREATE
    createComplaint: async (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Complaint> => {
        await sleep(DELAY);
        const complaints = getComplaints();

        const newComplaint: Complaint = {
            ...data,
            id: `CMP-${Date.now().toString().slice(-6)}`, // generate short ID
            status: 'submitted',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        complaints.unshift(newComplaint); // Add to top
        saveComplaints(complaints);
        return newComplaint;
    },

    // GET ALL (Admin)
    getAllComplaints: async (): Promise<Complaint[]> => {
        await sleep(DELAY);
        return getComplaints();
    },

    // GET USER COMPLAINTS
    getUserComplaints: async (userId: string): Promise<Complaint[]> => {
        await sleep(DELAY);
        const complaints = getComplaints();
        return complaints.filter(c => c.userId === userId);
    },

    // UPDATE STATUS
    updateStatus: async (id: string, status: Complaint['status']): Promise<Complaint> => {
        await sleep(DELAY);
        const complaints = getComplaints();
        const index = complaints.findIndex(c => c.id === id);

        if (index === -1) throw new Error('Complaint not found');

        const updated = {
            ...complaints[index],
            status,
            updatedAt: new Date().toISOString()
        };

        complaints[index] = updated;
        saveComplaints(complaints);
        return updated;
    },

    // GET STATISTICS
    getStats: async () => {
        await sleep(DELAY);
        const complaints = getComplaints();
        return {
            total: complaints.length,
            resolved: complaints.filter(c => c.status === 'resolved' || c.status === 'verified').length,
            pending: complaints.filter(c => c.status === 'submitted' || c.status === 'in-progress').length,
            critical: complaints.filter(c => c.priority === 'critical' || c.priority === 'high').length
        };
    }
};
