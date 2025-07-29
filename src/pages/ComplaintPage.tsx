import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import ComplaintForm from '@/components/Forms/ComplaintForm';

const ComplaintPage: React.FC = () => {
  const handleComplaintSubmit = (complaint: any) => {
    console.log('Submitted complaint:', complaint);
    // Here you would typically send the data to your backend
    alert('Complaint submitted successfully! Your complaint ID is: ' + complaint.id);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header title="Submit Complaint" showBackButton />
      
      <main className="py-8">
        <ComplaintForm onSubmit={handleComplaintSubmit} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ComplaintPage;