import clsx from 'clsx';
import Link from 'next/link';
import {
  Avatar,
  Chip,
  getKeyValue,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';

import { LinkIcon } from '../icons';
import { DropdownContent } from '../dropDown';

import { ColumnType } from '@/types';
import { ageWithPlural, formatDate } from '@/shared/utils/utils';

export type DataTableProps<Data extends object> = {
  data: Data[];
  label: string;
  limit?: string;
  isLoading?: boolean;
  columnKeys: Array<ColumnType>;
  onAction?: (id: string, action: 'delete' | 'edit') => void;
};

export function AdminsTable<Data extends object>({
  label,
  data,
  limit,
  columnKeys,
  onAction,
  isLoading = false,
}: DataTableProps<Data>) {
  return (
    <Table
      aria-label={label}
      className="p-0 hidden sm:flex"
      classNames={{
        wrapper: 'p-0',
        th: 'p-0 flex bg-(--header-color) font-semibold text-(--text-table) text-sm cursor-default border-(--border-table-header) border-b-1',
        tr: 'flex',
        td: 'p-0 flex w-full justify-start items-center',
      }}
      shadow="none"
    >
      <TableHeader className="px-6" columns={columnKeys}>
        {(column) => (
          <TableColumn
            key={column.key}
            className={clsx(
              `flex items-center !rounded-none ${column.width}`,
              { 'p-0': column.key === 'actions' },
              { 'pl-20': label === 'Администраторы' },
              {
                'justify-center':
                  column.key === 'likes' ||
                  column.key === 'postsTotal' ||
                  column.key === 'weight' ||
                  column.key === 'role',
              },
              { 'p-0 grow pl-6': column.key === 'admins' }
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
                  `flex border-(--input-border) p-0 items-center justify-center h-16 border-b-1 ${columnKeys.find((el) => el.key === columnKey)?.width}}`,
                  { 'pl-20': label === 'Администраторы' },
                  {
                    'pl-5':
                      label !== 'Администраторы' && columnKey === 'actions',
                  },
                  {
                    'text-center':
                      columnKey === 'likes' ||
                      columnKey === 'postsTotal' ||
                      columnKey === 'weight' ||
                      columnKey === 'role',
                  },
                  { grow: columnKey === 'admins' },
                  { 'justify-start': columnKey === 'sex' },
                  { 'pl-6': columnKey === 'admins' }
                );

                if (columnKey === 'email') {
                  return (
                    <TableCell className={cellStyle}>
                      <div className="flex w-full items-center">
                        <div className="overflow-hidden items-start text-ellipsis text-(--color-primary)">
                          {getKeyValue(item, columnKey)}
                        </div>
                      </div>
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
                if (columnKey === 'admins') {
                  return (
                    <TableCell className={cellStyle}>
                      <div className="flex w-full gap-2 items-center justify-start">
                        <Avatar
                          className="w-6 h-6 text-tiny"
                          src={getKeyValue(item, 'image')}
                        />
                        {getKeyValue(item, 'firstName') &&
                          getKeyValue(item, 'firstName') +
                            ' ' +
                            getKeyValue(item, 'lastName')}
                      </div>
                    </TableCell>
                  );
                }

                if (columnKey === 'sex') {
                  const sex =
                    getKeyValue(item, 'gender') === 'male'
                      ? 'Мужской'
                      : 'Женский';

                  return <TableCell className={cellStyle}>{sex}</TableCell>;
                }
                if (columnKey === 'actions') {
                  return (
                    <TableCell className={cellStyle}>
                      <div className="flex w-full items-center justify-start">
                        <DropdownContent
                          onAction={(actionKey) => {
                            onAction &&
                              onAction(getKeyValue(item, 'id'), actionKey);
                          }}
                        />
                      </div>
                    </TableCell>
                  );
                }
                if (columnKey === 'birthDate') {
                  return (
                    <TableCell className={cellStyle}>
                      <div className="flex w-full">
                        {formatDate(getKeyValue(item, columnKey))}
                        {ageWithPlural(getKeyValue(item, 'age'))}
                      </div>
                    </TableCell>
                  );
                }
                if (columnKey === 'weight') {
                  return (
                    <TableCell className={cellStyle}>
                      {String(getKeyValue(item, columnKey)).split('.')[0]}
                    </TableCell>
                  );
                }
                if (columnKey === 'role') {
                  return (
                    <TableCell className={cellStyle}>
                      <Chip
                        className="text-tiny"
                        color={
                          String(getKeyValue(item, columnKey)).split('.')[0] ===
                          'admin'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {String(getKeyValue(item, columnKey)).split('.')[0] ===
                        'admin'
                          ? 'Администратор'
                          : 'Автор'}
                      </Chip>
                    </TableCell>
                  );
                }

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
