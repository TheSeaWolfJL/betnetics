'use client';

import clsx from 'clsx';
import NextLink from 'next/link';
import { Avatar } from '@heroui/react';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';

import { siteConfig } from '@/config/site';
import { LogoIcon, LogOutIcon } from '@/components/icons';

type NavigationType = {
  name: string;
  pathname: string;
  lastname: string;
  username: string;
  logout: () => void;
};

export const Navbar = ({
  pathname,
  name,
  lastname,
  username,
  logout,
}: NavigationType) => {
  return (
    <nav className="flex min-h-[68px] sm:flex-col rounded-b-2xl sm:rounded-none justify-start items-center sm:max-w-[288px] w-full h-full sm:pb-[96px] px-5 sm:px-8 bg-white">
      <div className="flex flex-col w-full h-full items-start justify-center sm:justify-start sm:items-center flex-start sm:gap-10">
        <NextLink className="flex sm:pt-8 justify-start items-center" href="/">
          <LogoIcon
            className="max-h-[19px] max-w-[74px] sm:max-w-full sm:max-h-auto min-h-[17px] sm:min-h-[25px] text-(--color-primary)"
            height={25}
            width={100}
          />
        </NextLink>
        <ul className="hidden sm:flex flex-col items-center justify-center ml-2 gap-4 w-full">
          {siteConfig.navItems.map((item) => (
            <li
              key={item.href}
              className={clsx(
                `flex items-center pl-4 w-full h-8 sm:h-10 rounded-2xl `,
                { 'bg-(--color-secondary)': item.href === pathname }
              )}
            >
              <NextLink
                className={clsx('flex gap-2 w-full', {
                  'text-(--color-primary)': item.href === pathname,
                })}
                color="foreground"
                href={item.href}
              >
                {item.icon}
                {item.label}
              </NextLink>
            </li>
          ))}
        </ul>
      </div>
      <Card className="flex sm:flex-col flex-row w-full h-full sm:bg-(--color-bg-main) sm:min-h-10 sm:p-3 max-h-[123px] rounded-none sm:rounded-xl max-w-46 sm:max-w-full min-w-46 shadow-none">
        <CardBody className="flex flex-row gap-2 items-center sm:gap-3 max-h-8 sm:max-h-10 p-0 overflow-hidden">
          <Avatar
            className="flex sm:w-10 sm:h-10 h-8 w-8 sm:min-w-10"
            name={name}
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
          <div className="sm:text-sm cursor-default max-h-8 sm:max-h-10  max-w-25 sm:max-w-full text-xs truncate">
            <div className="flex">
              <div className="max-w-30 sm:max-w-full truncate overflow-hidden text-ellipsis">
                <span className="max-w-4 truncate overflow-hidden text-ellipsis">
                  <span>{name}</span>
                  &nbsp;{lastname}
                </span>
              </div>
            </div>
            <p className="text-(--color-primary) overflow-hidden text-ellipsis">
              @{username}
            </p>
          </div>
        </CardBody>
        <Button
          className="bg-(--color-secondary) text-(--color-primary) sm:w-full h-8 sm:h-10 max-h-8 sm:max-h-10 sm:max-w-full min-w-8 p-0 sm:mt-[18px] rounded-lg sm:rounded-[14px]"
          onPress={logout}
        >
          <LogOutIcon />
          <span className="hidden sm:block">Выход</span>
        </Button>
      </Card>
    </nav>
  );
};
