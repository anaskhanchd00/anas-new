import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * CustomerCenterPage acts as a secure landing router.
 * It detects active roles and redirects to the appropriate logically separated interface.
 */
const CustomerCenterPage: React.FC = () => {
  const { user, adminUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf8fa] gap-6">
        <Loader2 className="animate-spin text-[#e91e8c]" size={48} />
        <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Verifying Authority</p>
      </div>
    );
  }

  // Handle dual login scenarios
  if (adminUser && !user) return <Navigate to="/admin" replace />;
  if (user) return <Navigate to="/portal" replace />;

  return <Navigate to="/auth" />;
};

export default CustomerCenterPage;