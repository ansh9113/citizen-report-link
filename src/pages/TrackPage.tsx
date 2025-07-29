import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import StatusTracker from '@/components/Status/StatusTracker';

const TrackPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header title="Track Complaint" showBackButton />
      
      <main className="py-8">
        <StatusTracker />
      </main>
      
      <Footer />
    </div>
  );
};

export default TrackPage;