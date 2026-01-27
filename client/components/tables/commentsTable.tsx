import clsx from 'clsx';
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

import { ColumnType, DirectionType, SortStateType } from '@/types';

export type DataTableProps<Data extends object> = {
  label: string;
  currentSort?: SortStateType;
  nonSort?: Array<string>;
  columnKeys: Array<ColumnType>;
  data: Data[];
  onSortChange?: (columnKey: string, direction: DirectionType) => void;
  isLoading?: boolean;
};

export function CommentsTable<Data extends object>({
  label,
  data,
  nonSort,
  columnKeys,
  isLoading = false,
}: DataTableProps<Data>) {
  return (
    <Table
      aria-label={label}
      className="p-0 hidden sm:flex max-h-[550px]"
      classNames={{
        wrapper: 'p-0',
        th: 'p-0 bg-(--header-color) max-h-[44px] h-[44px] font-semibold text-(--text-table) text-sm cursor-default',
        tr: 'flex items-start',
      }}
      shadow="none"
    >
      <TableHeader className="px-6" columns={columnKeys}>
        {(column) => (
          <TableColumn
            key={column.key}
            allowsSorting={!nonSort?.includes(column.key)}
            className={clsx(`flex h-[44px] pl-4 items-center ${column.width}`, {
              'pl-8': column.key === 'comments',
            })}
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
                  `flex min-h-16 h-16 items-center border-(--input-border) border-b-1 ${columnKeys.find((el) => el.key === columnKey)?.width}`,
                  { 'pl-8': columnKey === 'comments' }
                );

                if (columnKey === 'userId')
                  return (
                    <TableCell className={cellStyle}>
                      <div className="flex gap-2 truncate overflow-hidden text-ellipsis">
                        <Avatar
                          className="min-w-6 w-6 h-6 text-tiny"
                          src={getKeyValue(item, columnKey).image}
                        />
                        <span className="truncate overflow-hidden text-ellipsis">
                          {getKeyValue(item, columnKey).name}
                        </span>
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
