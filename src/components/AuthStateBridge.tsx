"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/store/hooks';
import { setAuthState } from '@/store/slices/authSlice';

export default function AuthStateBridge() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setAuthState({
        status: status as any,
        user: session?.user
          ? {
              id: (session.user as any).id ?? null,
              name: session.user.name ?? null,
              email: session.user.email ?? null,
              image: session.user.image ?? null,
              phone: (session.user as any).phone ?? null,
            }
          : null,
      })
    );
  }, [status, session, dispatch]);

  return null;
}
