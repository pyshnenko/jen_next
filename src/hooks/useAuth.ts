'use client';

import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { setUser, userExit } from '@/src/store/userDataStore';
import { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import type { User } from '../types/frontGlobalTypes';

export interface AuthState {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAuth = (): AuthState => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    // Если пользователь уже загружен (не -1), ничего не делаем
    if (user && user.Id !== -1) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('/api/auth', { withCredentials: true });
      if (res.status === 200 && res.data?.authenticated) {
        dispatch(setUser(res.data.user));
      } else {
        dispatch(userExit()); // Убедимся, что состояние чистое
        router.push('/lk');
      }
    } catch (err) {
      console.error('Auth check failed', err);
      dispatch(userExit());
      router.push('/lk');
    } finally {
      setLoading(false);
    }
  }, [user, dispatch, router]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const logout = useCallback(async () => {
  try {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
  } catch (err) {
    console.error('Logout error', err);
  } finally {
    dispatch(userExit());
    router.push('/lk');
  }
}, [dispatch, router]);

const refresh = useCallback(async () => {
  setLoading(true);
  try {
    const res = await axios.get('/api/auth', { withCredentials: true });
    if (res.data.authenticated) {
      dispatch(setUser(res.data.user));
    } else {
      dispatch(userExit());
      router.push('/lk');
    }
  } catch (err) {
    dispatch(userExit());
    router.push('/lk');
  } finally {
    setLoading(false);
  }
}, [dispatch, router]);

  return { user, loading, logout, refresh };
};
