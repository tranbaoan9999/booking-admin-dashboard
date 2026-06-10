'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginSuccess, logout } from '@/store/slices/authSlice';
import { loginRequest, type LoginCredentials } from '@/lib/api/services/auth';

const SESSION_KEY = 'auth_user';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const { user: authUser, token } = await loginRequest(credentials);
      dispatch(loginSuccess(authUser));
      // Persist session so page refreshes don't log the user out
      localStorage.setItem(SESSION_KEY, JSON.stringify({ user: authUser, token }));
      router.push('/dashboard');
    },
    [dispatch, router],
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem(SESSION_KEY);
    router.push('/login');
  }, [dispatch, router]);

  const restoreSession = useCallback(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return false;
      const { user: authUser } = JSON.parse(raw) as { user: typeof user; token: string };
      if (authUser) {
        dispatch(loginSuccess(authUser));
        return true;
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    return false;
  }, [dispatch]);

  return { user, isAuthenticated, login, logout: logoutUser, restoreSession };
}
