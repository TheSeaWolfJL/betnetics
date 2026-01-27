'use client';

import { useEffect } from 'react';
import { Spinner } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { pageLimit } from '../constants';
import { getUrlLimits } from '../utils/urlLimitUtils';
import { getToken, updateTokens } from '../utils/cookieUtils';
import { authApi, useGetAuth } from '../api-services/auth/authApi';

import { Navbar } from '@/components/navbar';
import { useAppStore } from '@/store/app-store';
import { MobileNavbar } from '@/components/mobileNavbar';
import { AuthLayoutFooter } from '@/components/authLayoutFooter';
import { PaginationChange } from '@/types';
import notifyServerAfterApi from '../utils/notifyServerAfterApi';
import getSocket from '../socket';
import { addToast } from '@heroui/react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nextRouter = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accessToken = getToken('accessToken');
  const refreshToken = getToken('refreshToken');
  const { isAuth, setAuth, user, setUser } = useAppStore();
  const { data, isPending } = useGetAuth(accessToken, refreshToken);
  const mutation = useMutation({
    mutationFn: (refreshToken: string) => authApi.refreshToken(refreshToken),
  });
  const queryClient = useQueryClient();
  const logoutFn = () => {
    notifyServerAfterApi({
      type: 'info',
      message: 'You have been logged out',
    });
    updateTokens('', '');
    nextRouter.push('/');
  };

  // Listen for server websocket notifications and show toasts
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNotification = (payload: any) => {
      const { status, title, message, description } = payload || {};
      addToast({
        title: title || (status === 'error' ? 'Error' : 'Notification'),
        description: message || description || '',
        color:
          status === 'success'
            ? 'success'
            : status === 'error'
              ? 'danger'
              : 'primary',
      });
    };

    socket.on('setNotification', handleNotification);
    return () => {
      socket.off('setNotification', handleNotification);
    };
  }, []);

  useEffect(() => {
    if (!isAuth) {
      if (data?.id) {
        setAuth(true);
        setUser(data);
        updateTokens(data?.accessToken, data?.refreshToken);

        return;
      }
      mutation.mutate(refreshToken, {
        onSuccess: (res) => {
          setAuth(true);
          updateTokens(res.data.accessToken, res.data.refreshToken);
          queryClient.invalidateQueries({ queryKey: ['auth'] });

          return;
        },
        onError: (error) => {
          nextRouter.push('/');
          console.log('ошибочка');
        },
      });
    }
  }, [isAuth, isPending, mutation.isPending]);

  const handlePaginationChange = ({ type, value }: PaginationChange) => {
    const params = new URLSearchParams(searchParams.toString());

    if (type === 'limit') {
      params.set('limit', value);
    }

    if (type === 'page') {
      const limit = Number(getUrlLimits(searchParams).limit);

      params.set('skip', String((value - 1) * limit));
    }

    nextRouter.replace(`${pathname}?${params.toString()}`);
  };

  if (isPending || mutation.isPending) return <Spinner color="secondary" />;

  return (
    <div className="flex flex-col w-full sm:flex-row sm:h-full hide-scrollbar">
      <Navbar
        lastname={user?.lastName ?? 'defaultLastName'}
        logout={logoutFn}
        name={user?.firstName ?? 'defaultName'}
        pathname={pathname}
        username={user?.username ?? 'defaultUserName'}
      />
      <div className="flex flex-col truncate w-full pt-0 gap-5 pb-10">
        {children}
        <MobileNavbar pathname={pathname} />
        {!pathname.split('/').includes('profile') && (
          <AuthLayoutFooter
            handlePaginationChange={handlePaginationChange}
            limit={getUrlLimits(searchParams).limit}
            page={
              Number(getUrlLimits(searchParams).skip) /
                Number(getUrlLimits(searchParams).limit) +
              1
            }
            selectLabel="Показывать на странице"
            selectOptions={pageLimit}
            showInRowControls={15}
          />
        )}
      </div>
    </div>
  );
}
