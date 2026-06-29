export type UserRole = 'STUDENT' | 'PROFESSOR' | 'IT_EMPLOYEE' | 'HR_PROFESSIONAL' | 'MANAGER' | 'FREELANCER';

export interface User {
  userId: number;
  email: string;
  name: string;
  profilePictureUrl?: string;
  userRole: UserRole;
  onboardingComplete: boolean;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  name: string;
  profilePictureUrl?: string;
  userRole: UserRole;
  onboardingComplete: boolean;
}
