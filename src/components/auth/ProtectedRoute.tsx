import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, adminLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute check:', { user: !!user, loading, isAdmin, requireAdmin, adminLoading });
    
    if (!loading && !adminLoading) {
      if (!user) {
        console.log('No user, redirecting to auth');
        navigate('/auth');
        return;
      }
      
      if (requireAdmin && !isAdmin) {
        console.log('Admin required but user is not admin, redirecting to home');
        navigate('/');
        return;
      }
    }
  }, [user, loading, isAdmin, requireAdmin, adminLoading, navigate]);

  if (loading || (requireAdmin && adminLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    console.log('Blocking admin access - user is not admin');
    return null;
  }

  return <>{children}</>;
};