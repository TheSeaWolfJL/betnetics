import clsx from 'clsx';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Avatar,
  getKeyValue,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';

import { LinkIcon, SortIcon } from '../icons';

import { ColumnType, DirectionType, SortStateType } from '@/types';

export type DataTableProps<Data extends object> = {
  label: string;
  currentSort: SortStateType;
  nonSort?: Array<string>;
  columnKeys: Array<ColumnType>;
  data: Data[];
  onSortChange?: (columnKey: string, direction: DirectionType) => void;
  isLoading?: boolean;
  limit?: string;
};

export function PostsTable<Data extends object>({
  label,
  data,
  limit,
  nonSort,
  columnKeys,
  currentSort,
  onSortChange,
  isLoading = false,
}: DataTableProps<Data>) {
  const [sortedBy, setSort] = useState<SortStateType>({
    sortBy: '',
    direction: 'asc',
  });

  useEffect(() => {
    if (currentSort) {
      setSort(currentSort);
    }
  }, [data, currentSort]);

  return (
    <Table
      aria-label={label}
      className="p-0 hidden sm:flex max-h-[550px]"
      classNames={{
        wrapper: 'p-0',
        tr: 'flex flex-row',
        th: 'flex flex-row items-center p-0 bg-(--header-color) font-semibold text-(--text-table) text-sm cursor-default border-(--border-table-header) border-b-1',
      }}
      shadow="none"
      sortDescriptor={
        sortedBy.sortBy
          ? {
              column: sortedBy.sortBy,
              direction:
                sortedBy.direction === 'asc' ? 'ascending' : 'descending',
            }
          : undefined
      }
      sortIcon={SortIcon}
      onSortChange={(sortDescriptor) => {
        const column = String(sortDescriptor.column ?? '');
        const direction =
          sortDescriptor.direction === 'descending' ? 'desc' : 'asc';

        onSortChange?.(column, direction);
      }}
    >
      <TableHeader className="px-6" columns={columnKeys}>
        {(column) => (
          <TableColumn
            key={column.key}
            allowsSorting={!nonSort?.includes(column.key)}
            className={clsx(
              `!rounded-none ${column.width}`,
              { 'text-black': sortedBy.sortBy === column.key },
              {
                'cursor-pointer': !(
                  nonSort?.length && nonSort.includes(column.key)
                ),
              },
              { grow: column.key === 'title' },
              { 'p-0 pr-6': column.key === 'link' },
              { 'p-0 pl-6': column.key === 'id' },
              { 'pl-8': column.key === 'title' || column.key === 'userId' },
              {
                'text-center w-full items-center justify-center pl-8':
                  column.key === 'views' ||
                  column.key === 'reactions' ||
                  column.key === 'comments',
              }
            )}
            id={column.key}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={'No rows to display.'}
        isLoading={isLoading}
        items={data}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item: Data) => {
          const itemKey =
            'id' in item &&
            (typeof item.id === 'number' || typeof item.id === 'string')
              ? item.id
              : JSON.stringify(item);

          return (
            <TableRow key={itemKey}>
              {(columnKey) => {
                const cellStyle = clsx(
                  `flex items-center pl-8 border-(--input-border) h-16 border-b-1 ${columnKeys.find((el) => el.key === columnKey)?.width}}`,
                  { grow: columnKey === 'title' },
                  { 'pl-6': columnKey === 'id' },
                  {
                    'text-center w-full items-center justify-center pl-8':
                      columnKey === 'views' ||
                      columnKey === 'reactions' ||
                      columnKey === 'comments',
                  }
                );

                if (columnKey === 'reactions') {
                  const reactions = getKeyValue(item, columnKey) as
                    | { likes: number; dislikes: number }
                    | undefined;

                  return (
                    <TableCell className={cellStyle}>
                      {reactions?.likes}
                    </TableCell>
                  );
                }
                if (
                  columnKey === 'link' &&
                  'id' in item &&
                  (typeof item.id === 'number' || typeof item.id === 'string')
                ) {
                  return (
                    <TableCell className={cellStyle}>
                      <Link href={`posts/${item.id}?limit=${limit}`}>
                        <LinkIcon className="text-(--link-table)" />
                      </Link>
                    </TableCell>
                  );
                }
                if (columnKey === 'userId')
                  return (
                    <TableCell className={cellStyle}>
                      <div className="flex items-center gap-2">
                        <Avatar
                          className="w-6 h-6 text-tiny"
                          src={getKeyValue(item, columnKey).image}
                        />
                        {getKeyValue(item, columnKey).name}
                      </div>
                    </TableCell>
                  );

                return (
                  <TableCell className={cellStyle}>
                    {getKeyValue(item, columnKey)}
                  </TableCell>
                );
              }}
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
}
