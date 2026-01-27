import clsx from 'clsx';
import { Avatar, Card, Chip } from '@heroui/react';

import { DropdownContent } from './dropDown';
import { StatsFooter } from './statsFooter';

import { ageWithPlural, formatDate } from '@/shared/utils/utils';
import { GetUserType, PostType } from '@/types';

type PostCardType = {
  item: GetUserType & { postsTotal?: number; likes?: number };
  isAdmin?: boolean;
  onAction?: (id: string, action: 'delete' | 'edit') => void;
};

type ItemOmit = Omit<PostType, 'userId'>;
export type ItemType = ItemOmit & {
  userId: { image: string; name: string };
  comments: number;
};

export const UserCard = ({ item, isAdmin, onAction }: PostCardType) => {
  const Header = () => {
    return (
      <div className="flex text-(--text-label) w-full justify-between">
        <div className="flex flex-col items-start gap-2 w-full font-bold">
          <Avatar className="w-6 h-6 text-tiny" src={item.image} />
          <span>{item.firstName + ' ' + item.lastName}</span>
        </div>
        <DropdownContent
          onAction={(actionKey) =>
            onAction && onAction(String(item.id), actionKey)
          }
        />
      </div>
    );
  };
  const Footer = () => {
    const sex = item.gender === 'male' ? 'Мужской' : 'Женский';

    return (
      <div className="flex w-full items-center justify-start gap-2 cursor-default">
        <div className="w-[70%] max-w-[70%]">
          <p className="text-(--text-label)">Дата рождения</p>
          <p>
            {formatDate(item.birthDate)}
            <span className="text-(--text-label)">
              {ageWithPlural(item.age)}
            </span>
          </p>
        </div>
        <div className="w-[30%] max-w-[30%]">
          <p className="text-(--text-label)">Пол</p>
          <p>{sex}</p>
        </div>
      </div>
    );
  };

  return (
    <Card
      className={clsx(
        `flex text-sm w-full p-3 gap-2 rounded-none justify-center items-start border-(--input-border) border-b-1`
      )}
      shadow="none"
    >
      <Header />
      <div className="truncate overflow-hidden max-w-[300px] sm:max-w-[300px] text-ellipsis">
        <Chip
          className="text-tiny h-6"
          color={item.role === 'admin' ? 'warning' : 'default'}
        >
          {item.role === 'admin' ? 'Администратор' : 'Автор'}
        </Chip>
        <p className="text-semibold pt-2 truncate overflow-hidden text-(--color-primary) text-ellipsis">
          {item.email}
        </p>
      </div>
      <Footer />
      {!isAdmin && (
        <StatsFooter
          comments={Number(String(item.weight).split('.')[0])}
          likes={item.likes}
          views={item.postsTotal}
        />
      )}
    </Card>
  );
};
