import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header title="Admin Dashboard" />
      
      <main>
        <AdminDashboard />
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;