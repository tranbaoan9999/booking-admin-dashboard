'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, restoreSession } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const restored = restoreSession();
      if (!restored) {
        router.replace('/login');
        return;
      }
    }
    setChecked(true);
  }, [isAuthenticated, restoreSession, router]);

  if (!checked && !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
