import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';

/**
 * ProtectedRoute component for role-based and authentication-based route guarding.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to render if authorized
 * @param {Array<string>} [props.allowedRoles] - Roles allowed to access the route (e.g. ['owner'], ['user'])
 * @param {string} [props.unauthorizedRedirect='/'] - Where to redirect authenticated users who lack the required role
 */
export const ProtectedRoute = ({
  children,
  allowedRoles,
  unauthorizedRedirect = '/',
}) => {
  const { user, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();

  // If session check has not completed yet, show a clean loading state to prevent premature redirects
  if (!isInitialized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#C27A62] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-[#8B7E74]">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to /login with state to remember previous location
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route is restricted by roles and user role is not in allowedRoles
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If a regular user tries to access owner route, redirect to user landing page (unauthorizedRedirect, default '/')
    // If an owner tries to access a user-only page, redirect to owner dashboard
    const fallback = user.role === 'owner' ? '/owner/dashboard' : unauthorizedRedirect;
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
