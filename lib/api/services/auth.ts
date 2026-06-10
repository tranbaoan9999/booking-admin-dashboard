import { AuthUser } from '@/store/slices/authSlice';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResult {
  user: AuthUser;
  token: string;
}

// Placeholder — replace the body of this function with a real API call.
// e.g. POST /api/v1/auth/login  → { data: { user, token } }
export async function loginRequest(credentials: LoginCredentials): Promise<LoginResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (credentials.username === 'admin' && credentials.password === 'admin') {
    return {
      user: {
        username: 'admin',
        displayName: 'Admin User',
        role: 'ADMIN',
      },
      token: 'placeholder-token',
    };
  }

  throw new Error('Invalid username or password.');
}
