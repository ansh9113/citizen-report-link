import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, Clock, CheckCircle, User, Calendar, MapPin, Download, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { complaintService, Complaint } from '@/services/complaintService';

const StatusTracker: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<Complaint | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Auto-refresh for real-time updates
  useEffect(() => {
    if (!searchResult) return;

    const intervalId = setInterval(async () => {
      try {
        // Silently refresh the specific complaint
        const allComplaints = await complaintService.getAllComplaints();
        const updated = allComplaints.find(c => c.id === searchResult.id);
        if (updated && (updated.status !== searchResult.status || updated.updatedAt !== searchResult.updatedAt)) {
          setSearchResult(updated);
          toast.info("Complaint status updated!");
        }
      } catch (error) {
        console.error("Auto-refresh failed", error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [searchResult]);


  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error("Please enter a complaint ID");
      return;
    }

    setIsSearching(true);
    try {
      // Real service call setup:
      // Since we don't have a direct getById exposed in the simple service, 
      // we'll fetch all and find (or you can add getById to service).
      // For now, let's assume we can fetch all and filter client-side 
      // as this is a mock-backend app.
      const allComplaints = await complaintService.getAllComplaints();
      const found = allComplaints.find(c => c.id.toLowerCase() === searchId.toLowerCase());

      if (found) {
        setSearchResult(found);
        toast.success("Complaint details loaded");
      } else {
        setSearchResult(null);
        toast.error("Complaint not found. Please check ID.");
      }
    } catch (error) {
      console.error("Search error", error);
      toast.error("Failed to search complaint");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownloadReport = () => {
    toast.info("Report download started...");
  };

  const handleContactOfficer = () => {
    toast.info("Connecting to officer...");
  };

  const handleMarkSatisfied = async () => {
    if (!searchResult) return;
    try {
      await complaintService.updateStatus(searchResult.id, 'verified');
      toast.success("Thank you! Complaint marked as verified.");
      // Update local state immediately
      setSearchResult(prev => prev ? { ...prev, status: 'verified' } : null);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'verified': return 'bg-purple-100 text-purple-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to generate steps status based on current status
  const getSteps = (status: string) => {
    const statuses = ['submitted', 'in-progress', 'resolved', 'verified'];
    const currentIdx = statuses.indexOf(status);

    return [
      { id: '1', title: 'Submitted', completed: true },
      { id: '2', title: 'Processing', completed: currentIdx >= 1 },
      { id: '3', title: 'Resolved', completed: currentIdx >= 2 },
      { id: '4', title: 'Verified', completed: currentIdx >= 3 },
    ];
  };

  // Dynamic progress based on status
  const dynamicSteps = searchResult ? getSteps(searchResult.status) : [];
  const progressPercentage = (dynamicSteps.filter(s => s.completed).length / dynamicSteps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Track Your Complaint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Enter your complaint ID (e.g., CMP-XXXXXX)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Result */}
      {searchResult && (
        <div className="space-y-6">
          {/* Complaint Overview */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{searchResult.title}</span>
                    <Badge className={getStatusColor(searchResult.status)}>
                      {searchResult.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">{searchResult.description}</p>
                </div>
                <Badge className={getPriorityColor(searchResult.priority)}>
                  {searchResult.priority.toUpperCase()} PRIORITY
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(searchResult.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Reporter</p>
                    <p className="text-sm text-muted-foreground">
                      {searchResult.userName || 'Anonymous'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(searchResult.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {searchResult.location?.address || 'Lat: ' + searchResult.location?.lat.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Tracker */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Status</CardTitle>
              <div className="space-y-2">
                <Progress value={progressPercentage} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Current Status: {searchResult.status}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dynamicSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step.completed
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground border-2 border-border'
                      }`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                          {step.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" onClick={handleContactOfficer}>
              <Phone className="h-4 w-4 mr-2" />
              Contact Helpdesk
            </Button>
            {searchResult.status === 'resolved' && (
              <Button onClick={handleMarkSatisfied}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify Resolution
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Help Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Can't find your complaint ID? Check your emails or contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusTracker;