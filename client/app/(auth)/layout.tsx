import { ReactNode } from 'react';

import AuthLayout from '@/shared/layouts/authLayout';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default RootLayout;
