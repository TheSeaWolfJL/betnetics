import clsx from 'clsx';
import { Select, SelectItem } from '@heroui/select';

import { SelectArrowIcon } from './icons';

type SelectSortByProps<T extends readonly string[]> = {
  items: T;
  display?: boolean;
  label?: string;
  placeholder?: string;
  value: string;
  labelPlacement?:
    | 'outside'
    | 'outside-left'
    | 'outside-top'
    | 'inside'
    | undefined;
  selectionChange: (key: string | undefined) => void;
};

export const SelectSortBy = <T extends readonly string[]>({
  items,
  display,
  label,
  placeholder,
  labelPlacement,
  value,
  selectionChange,
}: SelectSortByProps<T>) => {
  return (
    <div
      className={clsx(
        'flex sm:flex-col items-center sm:items-start gap-3 w-full h-full sm:px-0 sm:h-[42px]',
        {
          'sm:hidden': !display,
        }
      )}
    >
      {/* <div className=" flex w-full flex-row flex-wrap gap-4"> */}
      <Select
        key="selectId"
        aria-label="sort-select"
        className="sm:w-full rounded-xl sm:shadow-xs"
        classNames={{
          innerWrapper: 'p-2 sm:h-[42px] shadow-none',
          mainWrapper: 'sm:h-[42px]',
          trigger: 'sm:h-[42px] sm:min-h-[42px] sm:mt-1 bg-white',
          base: 'sm:h-[42px] sm:gap-3 shadow-none',
          value: 'sm:h-[42px] sm:pt-[10px]',
          label: 'pb-[2px] text-sm',
          popoverContent: 'shadow-none border-1 border-(--border-table-header)',
        }}
        defaultSelectedKeys={[value]}
        label={label}
        labelPlacement={labelPlacement || 'outside'}
        placeholder={placeholder}
        radius={'md'}
        selectedKeys={[value]}
        selectionMode="single"
        selectorIcon={<SelectArrowIcon />}
        size="sm"
        variant="bordered"
        onSelectionChange={(keys) => {
          selectionChange(keys.currentKey);
        }}
      >
        {items.map((item, i) => (
          <SelectItem key={i}>{item}</SelectItem>
        ))}
      </Select>
      {/* </div> */}
    </div>
  );
};
