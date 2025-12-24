'use client';

import { useEffect } from 'react';
import { Spinner } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import { getToken, updateTokens } from '../utils/cookieUtils';
import { authApi, useGetAuth } from '../api-services/auth/authApi';

import { useAppStore } from '@/store/app-store';
import { Navbar } from '@/components/navbar';
import { MobileNavbar } from '@/components/mobileNavbar';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nextRouter = useRouter();
  const pathname = usePathname();
  const { isAuth, setAuth } = useAppStore();
  const accessToken = getToken('accessToken');
  const refreshToken = getToken('refreshToken');
  const { data, isPending } = useGetAuth(accessToken);
  const mutation = useMutation({
    mutationFn: (refreshToken: string) => authApi.refreshToken(refreshToken),
  });
  const logoutFn = () => {
    updateTokens('', '');
    nextRouter.push('/');
  };

  useEffect(() => {
    if (!isAuth) {
      if (data?.id) {
        setAuth(true);
        updateTokens(data?.accessToken, data?.refreshToken);

        return;
      }
      mutation.mutate(refreshToken, {
        onSuccess: (res) => {
          setAuth(true);
          updateTokens(res.data.accessToken, res.data.refreshToken);

          return;
        },
        onError: (error) => {
          nextRouter.push('/');
          console.log('ошибочка');
        },
      });
    }
  }, [isAuth, isPending, mutation.isPending, data]);
  if (isPending || mutation.isPending) return <Spinner color="secondary" />;
  if (!isAuth) nextRouter.push('/');

  return (
    <div className="flex flex-col sm:flex-row w-full sm:h-full sm:pb-10">
      <Navbar
        lastname={data?.firstName ?? 'defaultLastName'}
        logout={logoutFn}
        name={data?.firstName ?? 'defaultName'}
        pathname={pathname}
        username={data?.username ?? 'defaultUserName'}
      />
      {children}
      <MobileNavbar pathname={pathname} />
    </div>
  );
}
