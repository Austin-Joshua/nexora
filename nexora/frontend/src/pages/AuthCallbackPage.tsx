import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { PageLoader } from '../components/common/LoadingSpinner';

/**
 * Handles the OAuth callback redirect from the backend.
 * Backend redirects to /auth/callback?token=JWT&onboarding=true|false
 * Google may also redirect here with ?error=access_denied&error_description=...
 */
export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    // Handle Google OAuth errors (e.g., "access_denied", "no_access")
    const error = searchParams.get('error');
    if (error) {
      console.warn('Google OAuth error:', error, searchParams.get('error_description'));
      // Redirect to landing with an error flag so user sees a friendly message
      navigate(`/?auth_error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    const token    = searchParams.get('token');
    const onboard  = searchParams.get('onboarding') === 'true';
    const userId   = searchParams.get('userId');
    const email    = searchParams.get('email');
    const name     = searchParams.get('name');
    const role     = searchParams.get('role');
    const picture  = searchParams.get('picture');

    if (token) {
      setToken(token);
      if (userId && email && name && role) {
        setUser({
          userId: parseInt(userId),
          email,
          name,
          profilePictureUrl: picture ?? undefined,
          userRole: role as any,
          onboardingComplete: !onboard,
        });
      }
      navigate(onboard ? '/onboarding' : '/dashboard', { replace: true });
    } else {
      // No token and no error — something unexpected, go home
      navigate('/', { replace: true });
    }
  }, []);

  return <PageLoader />;
};
