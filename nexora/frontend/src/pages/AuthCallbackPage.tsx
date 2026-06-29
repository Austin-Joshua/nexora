import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { PageLoader } from '../components/common/LoadingSpinner';

/**
 * This page handles the OAuth callback redirect from the backend.
 * The backend's /api/auth/google/callback returns JSON — but if configured
 * to redirect to frontend instead, this component reads JWT from URL params.
 *
 * Usage: Backend redirects to /auth/callback?token=JWT&onboarding=true|false
 */
export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
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
      navigate('/', { replace: true });
    }
  }, []);

  return <PageLoader />;
};
