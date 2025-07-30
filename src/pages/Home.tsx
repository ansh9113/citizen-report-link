import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Users, 
  Phone,
  ArrowRight,
  TrendingUp,
  Shield,
  Bell
} from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const Home: React.FC = () => {
  const stats = [
    { label: 'Total Complaints', value: '0', icon: MessageSquare, change: '+0%' },
    { label: 'Resolved Issues', value: '0', icon: CheckCircle, change: '+0%' },
    { label: 'Active Citizens', value: '0', icon: Users, change: '+0%' },
    { label: 'Avg Resolution', value: '0 days', icon: Clock, change: '+0%' }
  ];

  const features = [
    {
      icon: MapPin,
      title: 'Location-Based Reporting',
      description: 'Report issues with precise GPS location using interactive maps'
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Get SMS and push notifications about your complaint status'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Track your complaint from submission to resolution'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    }
  ];

  const recentComplaints: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Report Issues.
              <span className="gradient-primary bg-clip-text text-transparent"> Track Progress.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Empower your community by reporting civic issues and tracking their resolution 
              in real-time. Building better cities through citizen participation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary shadow-elegant">
                Report an Issue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Track Complaint
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-elegant hover:shadow-glow transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-primary font-medium">{stat.change}</p>
                    </div>
                    <div className="p-3 gradient-primary rounded-full">
                      <stat.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it easy for citizens to report issues and for 
              authorities to manage and resolve them efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-elegant">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Recent Activity</h2>
            <Button variant="outline">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recentComplaints.length > 0 ? (
              recentComplaints.map((complaint, index) => (
                <Card key={index} className="hover:shadow-elegant transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-foreground">{complaint.title}</h3>
                      <Badge 
                        variant="secondary"
                        className={
                          complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {complaint.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {complaint.location}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{complaint.id}</span>
                        <Badge 
                          variant="outline"
                          className={
                            complaint.priority === 'High' ? 'border-red-200 text-red-700' :
                            'border-yellow-200 text-yellow-700'
                          }
                        >
                          {complaint.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{complaint.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Complaints Yet</h3>
                <p className="text-muted-foreground">Be the first to report an issue in your community!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="gradient-primary shadow-elegant">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-primary-foreground/90 text-lg mb-8">
                Join thousands of citizens who are helping build better communities. 
                Report an issue today and see the change happen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;