import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Пользователи',
};
export default function UsersPage() {
  return (
    <div>
      <h1 className={''}>Users</h1>
    </div>
  );
}
