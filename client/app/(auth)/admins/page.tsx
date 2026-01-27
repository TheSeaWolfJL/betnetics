'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDisclosure } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { AdminFormType, GetUserType } from '@/types';
import UserModal from '@/components/userModal';
import { UserCard } from '@/components/userCard';
import { formatDate } from '@/shared/utils/utils';
import { AddCircleIcon } from '@/components/icons';
import { adminsHeaderColumns } from '@/shared/constants';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { adminSchema } from '@/shared/schema/adminSchema';
import { getUrlLimits } from '@/shared/utils/urlLimitUtils';
import { AdminsTable } from '@/components/tables/adminsTable';
import { PostsHeadComponent } from '@/components/pageHeadComponent';
import { useGetUsers, usersApi } from '@/shared/api-services/users/usersApi';
import { useInitializeUrlParams } from '@/shared/hooks/useInitializeUrlParams';
import notifyServerAfterApi from '@/shared/utils/notifyServerAfterApi';
import getSocket from '@/shared/socket';
import { addToast } from '@heroui/react';

type AdminsModalModeType = 'edit' | 'create' | 'delete';

const defaultParams = {
  skip: '0',
  limit: '12',
  key: 'role',
  value: 'admin',
};

const adminModalFields = [
  {
    name: 'firstName' as keyof AdminFormType,
    placeholder: ' ',
    label: 'ФИО',
  },
  {
    name: 'email' as keyof AdminFormType,
    placeholder: ' ',
    label: 'Email',
    type: 'email',
  },

  {
    name: 'birthDate' as keyof AdminFormType,
    placeholder: ' ',
    label: 'Дата рождения',
  },
];

const modalHeaderTitle = {
  edit: {
    title: 'Редактирование администратора',
    actionButton: 'Соханить',
    closeButton: '',
  },
  create: { title: 'Добавление администратора', actionButton: 'Соханить' },
  delete: {
    title: 'Удаление пользователя',
    actionButton: 'Да, удалить',
    closeButton: 'Не удалять',
  },
};

export default function AdminPage() {
  const nextRouter = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useInitializeUrlParams(defaultParams);
  const mutation = useMutation({
    mutationFn: (formData: AdminFormType) => usersApi.addUser(formData),
  });
  const mutationEdit = useMutation({
    mutationFn: (formData: AdminFormType & { id: number }) =>
      usersApi.updateUser(formData),
  });
  const mutationDelete = useMutation({
    mutationFn: (id: number) => usersApi.deleteUser(id),
  });

  // Listen for server websocket notifications and show toasts
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNotification = (payload: any) => {
      const { status, title, message, description } = payload || {};
      addToast({
        title: title || (status === 'error' ? 'Error' : 'Notification'),
        description: message || description || '',
        color:
          status === 'success'
            ? 'success'
            : status === 'error'
              ? 'danger'
              : 'primary',
      });
    };

    socket.on('setNotification', handleNotification);
    return () => {
      socket.off('setNotification', handleNotification);
    };
  }, []);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [action, setAction] = useState<AdminsModalModeType>('create');
  const [userData, setUserData] = useState<GetUserType | undefined>(
    {} as GetUserType
  );
  const {
    formState: { errors },
    getValues,
    setValue,
    control,
    trigger,
    register,
    reset,
  } = useForm<AdminFormType>({
    mode: 'onChange',
    defaultValues: {
      birthDate: '',
      email: '',
      firstName: '',
    },
    resolver: zodResolver(adminSchema),
  });

  const { data, refetch } = useGetUsers({
    skip: getUrlLimits(searchParams).skip,
    limit: getUrlLimits(searchParams).limit,
    key: defaultParams.key,
    value: defaultParams.value,
    q: searchParams.get('q') || '',
  });

  // Removed manual refetch; query handles it automatically

  const debouncedSearch = useDebounce((search: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('q', search);
    const queryString = params.toString();

    nextRouter.replace(`${pathname}?${queryString}`);
  }, 300);

  const processForm = (payload: AdminFormType) => {
    if (action === 'create') {
      mutation.mutate(payload, {
        onSuccess: (res) => {
          console.log('Admin created successfully', res);
          notifyServerAfterApi({
            type: 'success',
            message: 'Admin created successfully',
          });
          refetch(); // Refresh the list
          onOpenChange(); // Close modal
          reset();
          return true;
        },
        onError: (error) => {
          console.error('Admin creation error', error);
          notifyServerAfterApi({
            type: 'error',
            message: 'Failed to create admin',
          });
          return false;
        },
      });
    }
    if (action === 'edit') {
      mutationEdit.mutate(
        { ...payload, id: userData?.id || 0 },
        {
          onSuccess: (res) => {
            console.log('Admin updated successfully', res);
            notifyServerAfterApi({
              type: 'success',
              message: 'Admin updated successfully',
            });
            refetch();
            onOpenChange();
            reset();
            setUserData({} as GetUserType);
            setAction('create');
          },
          onError: (error) => {
            console.error('Admin update error', error);
            notifyServerAfterApi({
              type: 'error',
              message: 'Failed to update admin',
            });
          },
        }
      );
    }
    if (action === 'delete') {
      mutationDelete.mutate(userData?.id || 0, {
        onSuccess: (res) => {
          console.log('Admin deleted successfully', res);
          notifyServerAfterApi({
            type: 'success',
            message: 'Admin deleted successfully',
          });
          refetch();
          onOpenChange();
          reset();
          setUserData({} as GetUserType);
          setAction('create');
        },
        onError: (error) => {
          console.error('Admin delete error', error);
          notifyServerAfterApi({
            type: 'error',
            message: 'Failed to delete admin',
          });
        },
      });
    }
  };

  const onActionHandle = (id: string, actionKey: 'edit' | 'delete') => {
    const admin = data?.data.users.find((user) => user.id === Number(id));

    setUserData(admin);
    setAction(actionKey);
    if (admin && actionKey === 'edit') {
      onOpen();
      setValue('email', admin.email);
      setValue('firstName', admin.firstName);
      setValue('birthDate', formatDate(admin.birthDate));
    }
    if (admin && actionKey === 'delete') {
      onOpen();
      setValue('firstName', admin.firstName);
    }
  };
  return (
    <div className="flex pt-[88px] flex-col w-full h-full items-start justify-start sm:px-20 sm:pt-20 gap-3 sm:gap-10 hide-scrollbar">
      <PostsHeadComponent
        description="Управление администраторами системы"
        hasButton={{
          contentStart: <AddCircleIcon className="min-w-5" />,
          text: 'Добавить администратора',
        }}
        placeholder="Поиск по администраторам"
        title="Администраторы"
        value={searchParams.get('q') || ''}
        onChange={debouncedSearch}
        onPress={onOpen}
      />
      <AdminsTable
        columnKeys={adminsHeaderColumns}
        data={data?.data.users || []}
        isLoading={false}
        label="Администраторы"
        limit={getUrlLimits(searchParams).limit}
        onAction={onActionHandle}
      />
      <div className="flex sm:hidden flex-col w-full h-full [&>*:first-child]:rounded-t-[20px] [&>*:last-child]:pb-10">
        {data?.data.users.map((userInfo, i) => {
          return (
            <UserCard
              key={i}
              isAdmin
              item={userInfo}
              onAction={onActionHandle}
            />
          );
        })}
        {!data?.data.users.length && <>Администраторы не найдены</>}
      </div>
      <UserModal
        actionButtons={modalHeaderTitle[action]}
        avatar={{ className: 'w-30 h-30 text-large', image: userData?.image }}
        bodyTitle={
          action === 'delete'
            ? `${userData?.firstName} ${userData?.lastName}`
            : ''
        }
        control={control}
        errors={errors}
        fields={action === 'delete' ? [] : adminModalFields}
        fullWidth={true}
        header={modalHeaderTitle[action].title}
        isDisabled={
          (Object.values(getValues()).includes('') && action !== 'delete') ||
          !!Object.keys(errors).length ||
          Object.values({
            birthDate: formatDate(userData?.birthDate || ''),
            email: userData?.email || '',
            firstName: userData?.firstName || '',
          }).join('') === Object.values(getValues()).join('')
        }
        isLoading={
          mutation.isPending ||
          mutationEdit.isPending ||
          mutationDelete.isPending
        }
        isOpen={isOpen}
        processForm={processForm}
        register={register}
        trigger={trigger}
        onOpenChange={() => {
          onOpenChange();
          reset();
          setUserData({} as GetUserType);
          setAction('create');
        }}
      />
    </div>
  );
}
