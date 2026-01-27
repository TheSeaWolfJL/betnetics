import { Input } from '@heroui/react';
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormTrigger,
} from 'react-hook-form';

type InputFormType<T extends FieldValues> = {
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
  trigger?: UseFormTrigger<T>;
  el: {
    name: keyof T;
    label: string;
    value?: string;
    placeholder: string;
    type?: string;
  };
};

export function InputForm<T extends FieldValues>(props: InputFormType<T>) {
  const { errors, register, trigger, el } = props;

  return (
    <Input
      className="flex relative rounded-xl"
      classNames={{
        label: 'text-(--text-subtext) tracking-[-0.09em]',
        helperWrapper: 'absolute top-8 sm:top-10',
        innerWrapper: 'max-h-[32px] sm:max-h-[42px] sm:min-h-[42px]',
        inputWrapper:
          'max-h-[32px] sm:max-h-[42px] min-h-[32px] sm:min-h-[42px] sm:h-[42px]',
      }}
      color={errors[el.name]?.type ? 'danger' : 'default'}
      errorMessage={errors[el.name]?.message as string}
      isInvalid={!!errors[el.name]?.type}
      label={el.label}
      labelPlacement="outside"
      defaultValue={el.value}
      // onValueChange={() => {
      //   console.log(3);
      // }}
      placeholder={el.placeholder}
      value={el.value}
      variant="bordered"
      type={el.type || 'text'}
      // onPaste={() => trigger && trigger(el.name as any)}
      onValueChange={() => trigger && trigger(el.name as any)}
      {...register(el.name as any)}
    />
  );
}
