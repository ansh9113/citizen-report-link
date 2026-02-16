import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import Header from '@/components/Layout/Header';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Edit State
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [mobile, setMobile] = useState(user?.mobile || '');
    const [address, setAddress] = useState(user?.address || '');

    if (!user) {
        return <div className="p-8 text-center">Please login to view profile.</div>;
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updates = { name, email, mobile, address };
            const response = await authService.updateProfile(user.id, updates);
            updateUser(response.user);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header title="My Profile" showBackButton />

            <main className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">

                {/* Header Card */}
                <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
                    <Avatar className="h-32 w-32 border-4 border-muted">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <Badge variant={user.role === 'admin' ? "default" : "secondary"}>
                                {user.role === 'admin' ? "Official" : "Citizen"}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">{user.email || user.mobile}</p>
                        {user.address && <p className="text-muted-foreground">{user.address}</p>}

                        {!isEditing && (
                            <Button className="mt-4" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                {/* Edit Form */}
                {isEditing && (
                    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Edit Details</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Add email"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile</Label>
                                <Input
                                    id="mobile"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Add address"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset to original
                                        setName(user.name);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;
