import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/src/store/useStore';

export function AuthGuard() {
  const { isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
