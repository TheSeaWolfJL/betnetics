import { Pagination } from '@heroui/react';

export const CustomPagination = (props: {
  page: number;
  showInRowControls: number;
  handlePaginationChange: (value: number) => void;
}) => {
  return (
    <>
      <Pagination
        isCompact
        showControls
        boundaries={-1}
        classNames={{
          wrapper:
            'overflow-visible cursor-pointer shadow-none border border-(--color-primary) border-2 rounded-none first:rounded-xl last:rounded-xl',
          item: 'text-small border-(--color-primary) first:border-left bg-transparent shadow-none border-l-2',
          prev: 'text-(--color-primary) bg-transparent rounded-none min-w-[52px] rounded-xl ',
          next: 'text-(--color-primary) bg-transparent rounded-none min-w-[52px] rounded-xl border-l-2',
        }}
        color="primary"
        initialPage={1}
        page={props.page}
        radius="none"
        siblings={1}
        size={'lg'}
        total={props.showInRowControls}
        onChange={props.handlePaginationChange}
      />
      <style global jsx>{`
        .nextui-pagination-item-ellipsis,
        [aria-label='dots element'] {
          display: none;
        }
      `}</style>
    </>
  );
};
