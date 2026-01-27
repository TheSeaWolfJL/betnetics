import { Select, SelectItem } from '@heroui/react';

import { CustomPagination } from './customPagination';

import { PaginationChange } from '@/types';

type PaginationAction = 'limit' | 'page';

export const AuthLayoutFooter = (props: {
  page: number;
  limit: string;
  selectLabel?: string;
  selectOptions: string[];
  showInRowControls: number;
  handlePaginationChange: ({ type, value }: PaginationChange) => void;
}) => {
  return (
    <div className="hidden sm:flex w-full justify-between px-20">
      <Select
        key={'underlined'}
        className="max-w-xs text-(--color-primary)"
        classNames={{
          trigger: 'shadow-none max-w-[50px] ',
          mainWrapper: 'max-w-[70px]',
          innerWrapper: '[&>*:first-child]:text-(--color-primary)',
          popoverContent: 'w-20 max-w-[80px]',
        }}
        label={props.selectLabel}
        labelPlacement={'outside-left'}
        selectedKeys={[props.limit]}
        variant={'underlined'}
        onSelectionChange={(keys) => {
          const newLimit = String(Object.values(keys)[0]);
          localStorage.setItem('limit', newLimit);
          props.handlePaginationChange({
            type: 'limit',
            value: newLimit,
          });
        }}
      >
        {props.selectOptions.map((limit) => (
          <SelectItem key={limit}>{limit}</SelectItem>
        ))}
      </Select>
      <CustomPagination
        handlePaginationChange={(value) =>
          props.handlePaginationChange({ type: 'page', value })
        }
        page={props.page}
        showInRowControls={props.showInRowControls}
      />
    </div>
  );
};
