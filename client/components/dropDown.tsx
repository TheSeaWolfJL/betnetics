import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';

import { DotsIcon, EditIcon, RemoveIcon } from './icons';

export const DropdownContent = (props: {
  onAction?: (actionKey: 'edit' | 'delete') => void;
}) => (
  <Dropdown
    classNames={{
      content: 'p-0',
    }}
    placement="bottom-end"
  >
    <DropdownTrigger>
      <Button
        className="max-w-10 max-h-10 sm:w-10 h-6 w-6 rounded-md sm:rounded-lg sm:h-10 min-w-6 sm:min-w-10 p-0"
        color="default"
        variant={'light'}
      >
        <DotsIcon className="text-(--link-table)" />
      </Button>
    </DropdownTrigger>
    <DropdownMenu
      aria-label="Actions menu"
      className="p-0"
      color="default"
      variant={'light'}
    >
      <DropdownItem
        key="edit"
        className="border-b-1 border-(--border-table-header) rounded-none px-4 py-[10px]"
        startContent={<EditIcon />}
        onClick={() => props.onAction && props.onAction('edit')}
      >
        Редактировать
      </DropdownItem>

      <DropdownItem
        key="delete"
        className="text-(--text-danger) px-4 py-[10px]"
        startContent={<RemoveIcon />}
        onClick={() => props.onAction && props.onAction('delete')}
      >
        Удалить
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
);
