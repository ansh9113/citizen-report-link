import React from 'react';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';
import AdminLayout from '@/components/Layout/AdminLayout';

const AdminPage: React.FC = () => {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default AdminPage;