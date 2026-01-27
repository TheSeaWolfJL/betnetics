import { EyeIcon, HeartIcon, MessagesIcon } from './icons';

export const StatsFooter = (props: {
  views?: number;
  likes?: number;
  comments?: number;
}) => {
  return (
    <div className="flex text-(--link-table) w-full items-center justify-start gap-2 cursor-default">
      <div className="flex min-w-16 max-w-16 gap-1 items-center">
        <EyeIcon />
        <span>{props.views}</span>
      </div>

      <div className="flex min-w-16 max-w-16 gap-1 items-center">
        <HeartIcon />
        <span>{props.likes}</span>
      </div>
      <div className="flex min-w-16 max-w-16 gap-1 items-center">
        <MessagesIcon />
        <span>{props.comments}</span>
      </div>
    </div>
  );
};
