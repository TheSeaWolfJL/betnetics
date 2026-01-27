import clsx from 'clsx';
import NextLink from 'next/link';

import { siteConfig } from '@/config/site';

export const MobileNavbar = ({ pathname }: { pathname: string }) => {
  return (
    <ul className="flex fixed bottom-0 left-0 h-[60px] bg-(--color-bg-main) border-t-1 border-(--navbar-border) sm:hidden items-center justify-center gap-1 w-full pt-2">
      {siteConfig.navItems.map((item) => (
        <li key={item.href} className="flex w-full h-full">
          <NextLink
            className={clsx(
              `flex flex-col gap-2 w-full text-xs items-center justify-center `,
              {
                'text-(--color-primary)': pathname
                  .split('/')
                  .includes(item.href.slice(1)),
              }
            )}
            color="foreground"
            href={item.href}
            id={item.href}
          >
            <div className="w-5 h-5">{item.icon}</div>
            {item.label}
          </NextLink>
        </li>
      ))}
    </ul>
  );
};
