import type { UserRole } from '../types/User';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const { user, token, isAuthenticated, setUser, setToken, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = authApi.getGoogleAuthUrl();
  };

  const handleLogout = async () => {
    try {
      await authApi.revokeAccess();
    } catch {
      // ignore
    }
    logout();
    navigate('/');
  };

  const updateRole = async (role: UserRole) => {
    const authResponse = await authApi.updateProfile(role);
    setToken(authResponse.token);
    setUser({
      userId: authResponse.userId,
      email: authResponse.email,
      name: authResponse.name,
      profilePictureUrl: authResponse.profilePictureUrl,
      userRole: authResponse.userRole,
      onboardingComplete: authResponse.onboardingComplete,
    });
  };

  return { user, token, isAuthenticated, handleGoogleLogin, handleLogout, updateRole };
}
