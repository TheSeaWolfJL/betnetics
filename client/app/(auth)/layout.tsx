import { Metadata } from 'next';
import { ReactNode } from 'react';
import AuthLayout from '@/shared/layouts/authLayout';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'user profile',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
    return <AuthLayout>{children}</AuthLayout>;
};

export default RootLayout;