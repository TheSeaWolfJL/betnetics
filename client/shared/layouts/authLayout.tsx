'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app-store';
import { authApi, useGetAuth } from '../api-services/auth/authApi';
import { getToken } from '../utils/getTokens';
import { setCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '@heroui/react';

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const nextRouter = useRouter();
    const { isAuth, setAuth } = useAppStore();
    const accessToken = getToken('accessToken')
    const refreshToken = getToken('refreshToken')
    const { data, isPending } = useGetAuth(accessToken)
    const mutation = useMutation({
        mutationFn: (refreshToken: string) => authApi.refreshToken(refreshToken),
    });
    useEffect(() => {
        if (!isAuth) {
            if (data?.id) {
                setAuth(true);
                setCookie('accessToken', data?.accessToken)
                setCookie('refreshToken', data?.refreshToken)
                return
            }
            mutation.mutate(refreshToken, {
                onSuccess: (res) => {
                    setAuth(true);
                    setCookie('accessToken', res.data.accessToken)
                    setCookie('refreshToken', res.data.refreshToken)
                    return

                },
                onError: (error) => {
                    nextRouter.push('/');
                },
            });
        }
    }, [isAuth, isPending, mutation.isPending, data]);
    if (isPending || mutation.isPending) return <Spinner color="secondary" />
    if (!isAuth) nextRouter.push('/');
    return <div>
        
        {children}
        </div>
}