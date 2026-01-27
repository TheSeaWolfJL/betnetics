import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import {
  Form,
  Control,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormTrigger,
} from 'react-hook-form';
import clsx from 'clsx';

import { InputForm } from './InputForm';

export default function UserModal<T extends FieldValues>(props: {
  isOpen: boolean;
  header?: string;
  bodyTitle?: string;
  control?: Control<T, any, T>;
  fullWidth?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  errors: FieldErrors<T>;
  fields: {
    name: keyof T;
    label: string;
    placeholder: string;
    type?: string;
  }[];
  avatar?: {
    className?: string;
    image?: string;
  };
  processForm: (e: T) => void;
  trigger: UseFormTrigger<T>;
  onOpenChange: () => void;
  actionButtons: {
    // title: string;
    actionButton?: string;
    closeButton?: string;
    className?: string;
  };
  register: UseFormRegister<T>;
  avatarClassName?: string;
}) {
  return (
    <Modal
      className="flex sm:min-w-[565px] min-w-full h-full sm:w-auto sm:h-auto rounded-none sm:rounded-xl p-0 m-0"
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1" />
            <Form
              className={clsx(
                'flex flex-col pt-7 gap-5 sm:px-15 px-5 sm:gap-10 w-full h-full',
                {
                  'gap-5': !!props.bodyTitle,
                }
              )}
              control={props.control}
              onSubmit={({ data }) => {
                props.processForm(data);
              }}
            >
              <ModalBody
                className={clsx(
                  'flex items-center sm:max-h-auto justify-start sm:justify-center gap-3 sm:gap-10 p-0',
                  {
                    'gap-5': !!props.bodyTitle,
                  }
                )}
              >
                <h1 className="font-bold text-center text-xl sm:text-4xl">
                  {props.header}
                </h1>

                {props.avatar && !props.bodyTitle && (
                  <Avatar
                    className={props.avatar?.className}
                    src={props.avatar?.image}
                  />
                )}
                {!!props.fields.length && (
                  <div className="flex flex-col w-full gap-[28px]">
                    {props.fields.map((el, i) => (
                      <InputForm
                        key={i}
                        el={el}
                        errors={props.errors}
                        register={props.register}
                        trigger={props.trigger}
                      />
                    ))}
                  </div>
                )}
                {!!props.bodyTitle && (
                  <div className="flex flex-col items-center w-full gap-5">
                    <div className="flex flex-col w-full items-center">
                      <h1>Вы уверены, что хотите удалить пользователя</h1>
                      <div className="flex">
                        <p className="font-bold">{props.bodyTitle}</p>?
                      </div>
                    </div>
                    <p>Данное действие отменить невозможно</p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="flex w-full h-full sm:items-center justify-between p-0 pb-15 gap-5 sm:gap-10">
                {props.actionButtons.closeButton && (
                  <Button
                    color="default"
                    fullWidth={
                      (props.fullWidth && !props.bodyTitle) || !!props.bodyTitle
                    }
                    onPress={onClose}
                  >
                    {props.actionButtons.closeButton}
                  </Button>
                )}
                {props.actionButtons.actionButton && (
                  <Button
                    color="primary"
                    fullWidth={
                      (props.fullWidth && !props.bodyTitle) || !!props.bodyTitle
                    }
                    isDisabled={props.isDisabled}
                    isLoading={props.isLoading}
                    type="submit"
                  >
                    {props.actionButtons.actionButton}
                  </Button>
                )}
              </ModalFooter>
            </Form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
