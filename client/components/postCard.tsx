import Link from 'next/link';
import { Avatar, Card } from '@heroui/react';

import { LinkIcon } from './icons';
import { StatsFooter } from './statsFooter';

import { PostType } from '@/types';

type PostCardType = {
  index: number;
  item: ItemType;
};

type ItemOmit = Omit<PostType, 'userId'>;
export type ItemType = ItemOmit & {
  userId: { image: string; name: string };
  comments: number;
};

export const PostCard = ({ index, item }: PostCardType) => {
  const Header = () => {
    return (
      <div className="flex text-(--text-label) w-full items-center justify-between">
        <span>{item.id}</span>
        <Link href={`posts/${item.id}`}>
          <LinkIcon className="text-(--link-table)" />
        </Link>
      </div>
    );
  };

  return (
    <Card
      className={
        'flex text-sm w-full p-3 gap-2 rounded-none max-h-[164px] justify-center items-start border-(--input-border) border-b-1'
      }
      shadow="none"
    >
      {item.views && <Header />}
      <div className="flex items-center gap-2 w-full">
        <Avatar className="w-6 h-6 text-tiny" src={item.userId.image} />
        <span>{item.userId.name}</span>
      </div>
      <div className="truncate overflow-hidden max-w-[300px] sm:max-w-[300px] text-ellipsis">
        <span className="text-semibold truncate  overflow-hidden text-ellipsis">
          {item.title}
        </span>
      </div>
      {item.views && (
        <StatsFooter
          comments={item.comments}
          likes={item.reactions.likes}
          views={item.views}
        />
      )}
    </Card>
  );
};
