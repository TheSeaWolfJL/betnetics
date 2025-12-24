import { AdminsIcon, PostsIcon, UsersIcon } from '@/components/icons';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Betnetics test Frontend',
  description: 'Beautiful website',
  navItems: [
    {
      label: 'Публикации',
      href: '/posts',
      icon: <PostsIcon />,
    },
    {
      label: 'Администраторы',
      href: '/admins',
      icon: <AdminsIcon />,
    },
    {
      label: 'Пользователи',
      href: '/users',
      icon: <UsersIcon />,
    },
  ],
};
