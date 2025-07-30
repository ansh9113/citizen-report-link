import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, Clock, CheckCircle, AlertCircle, User, Calendar, MapPin, Download, Phone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface StatusStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  timestamp?: string;
  officer?: string;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'submitted' | 'verified' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  steps: StatusStep[];
  assignedOfficer?: string;
  estimatedResolution?: string;
}

const StatusTracker: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<Complaint | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for demonstration
  const mockComplaint: Complaint = {
    id: 'CR-2024-001',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues near the market area',
    type: 'road',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-17T14:30:00Z',
    location: {
      lat: 22.7196,
      lng: 75.8577,
      address: 'Main Street, Near Central Market, Indore, MP'
    },
    assignedOfficer: 'Rajesh Kumar (PWD)',
    estimatedResolution: '2024-01-20',
    steps: [
      {
        id: '1',
        title: 'Complaint Submitted',
        description: 'Your complaint has been successfully submitted',
        completed: true,
        timestamp: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Verification',
        description: 'Complaint verified by concerned department',
        completed: true,
        timestamp: '2024-01-16T09:30:00Z',
        officer: 'Priya Sharma (Admin)'
      },
      {
        id: '3',
        title: 'Work in Progress',
        description: 'Field team assigned and work has started',
        completed: true,
        timestamp: '2024-01-17T14:30:00Z',
        officer: 'Rajesh Kumar (PWD)'
      },
      {
        id: '4',
        title: 'Resolution',
        description: 'Issue resolved and awaiting final verification',
        completed: false
      },
      {
        id: '5',
        title: 'Closed',
        description: 'Complaint closed after successful resolution',
        completed: false
      }
    ]
  };

  const handleSearch = () => {
    if (!searchId.trim()) {
      toast({
        title: "Please enter a complaint ID",
        description: "Enter your complaint ID to track status",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      if (searchId.toLowerCase().includes('cr-')) {
        setSearchResult(mockComplaint);
        toast({
          title: "Complaint Found",
          description: "Your complaint details have been loaded",
        });
      } else {
        setSearchResult(null);
        toast({
          title: "Complaint Not Found",
          description: "Please check your complaint ID and try again",
          variant: "destructive"
        });
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleDownloadReport = () => {
    toast({
      title: "Downloading Report",
      description: "Your complaint report is being prepared",
    });
  };

  const handleContactOfficer = () => {
    toast({
      title: "Contacting Officer",
      description: "You will be connected to the assigned officer",
    });
  };

  const handleMarkSatisfied = () => {
    toast({
      title: "Thank You!",
      description: "Your feedback has been recorded",
    });
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

  const getProgressPercentage = (steps: StatusStep[]) => {
    const completedSteps = steps.filter(step => step.completed).length;
    return (completedSteps / steps.length) * 100;
  };

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
                placeholder="Enter your complaint ID (e.g., CR-2024-001)"
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
                    <p className="text-sm font-medium">Assigned Officer</p>
                    <p className="text-sm text-muted-foreground">
                      {searchResult.assignedOfficer || 'Not assigned'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Expected Resolution</p>
                    <p className="text-sm text-muted-foreground">
                      {searchResult.estimatedResolution 
                        ? new Date(searchResult.estimatedResolution).toLocaleDateString()
                        : 'TBD'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {searchResult.location.address || 'Location coordinates provided'}
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
                <Progress value={getProgressPercentage(searchResult.steps)} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  {searchResult.steps.filter(step => step.completed).length} of {searchResult.steps.length} steps completed
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {searchResult.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed 
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
                        <h3 className={`text-sm font-medium ${
                          step.completed ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </h3>
                        {step.completed && step.timestamp && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(step.timestamp).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.description}
                      </p>
                      
                      {step.officer && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Handled by: {step.officer}
                        </p>
                      )}
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
              Contact Officer
            </Button>
            {searchResult.status === 'resolved' && (
              <Button onClick={handleMarkSatisfied}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Satisfied
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
              Can't find your complaint ID? Check your SMS/Email or contact support at 1800-XXX-XXXX
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusTracker;