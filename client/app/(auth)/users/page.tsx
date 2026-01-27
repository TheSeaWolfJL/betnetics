'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { useDisclosure } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { AddCircleIcon } from '@/components/icons';
import { PostsHeadComponent } from '@/components/pageHeadComponent';
import { AdminsTable } from '@/components/tables/adminsTable';
import { UserCard } from '@/components/userCard';
import UserModal from '@/components/userModal';
import {
  useGetPostsUser,
  useGetUsers,
  usersApi,
} from '@/shared/api-services/users/usersApi';
import { usersHeaderColumns } from '@/shared/constants';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useInitializeUrlParams } from '@/shared/hooks/useInitializeUrlParams';
import { adminSchema } from '@/shared/schema/adminSchema';
import { getUrlLimits } from '@/shared/utils/urlLimitUtils';
import { formatDate } from '@/shared/utils/utils';
import { AdminFormType, GetUserType } from '@/types';
import notifyServerAfterApi from '@/shared/utils/notifyServerAfterApi';
import getSocket from '@/shared/socket';
import { addToast } from '@heroui/react';

type UsersModalModeType = 'edit' | 'create' | 'delete';

const defaultParams = {
  skip: '0',
  limit: '12',
};

const adminModalFields = [
  {
    name: 'firstName' as keyof AdminFormType,
    placeholder: 'Иванов Иван Иванович',
    label: 'ФИО',
  },
  {
    name: 'email' as keyof AdminFormType,
    placeholder: 'admin@example.com',
    label: 'Email',
    type: 'email',
  },

  {
    name: 'birthDate' as keyof AdminFormType,
    placeholder: '19.09.1990',
    label: 'Дата рождения',
  },
];

const modalHeaderTitle = {
  edit: {
    title: 'Редактирование пользователя',
    actionButton: 'Соханить',
    closeButton: '',
  },
  create: { title: 'Добавление пользователя', actionButton: 'Соханить' },
  delete: {
    title: 'Удаление пользователя',
    actionButton: 'Да, удалить',
    closeButton: 'Не удалять',
  },
};

const userModalFields = [
  {
    name: 'firstName' as keyof AdminFormType,
    placeholder: 'Иванов Иван Иванович',
    label: 'ФИО',
  },
  {
    name: 'email' as keyof AdminFormType,
    placeholder: 'admin@example.com',
    label: 'Email',
    type: 'email',
  },

  {
    name: 'birthDate' as keyof AdminFormType,
    placeholder: '19.09.1990',
    label: 'Дата рождения',
  },
];

export default function UsersPage() {
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [action, setAction] = useState<UsersModalModeType>('create');
  const [userData, setUserData] = useState<GetUserType | undefined>(
    {} as GetUserType
  );

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

  const {
    data,
    isLoading: loading,
    refetch,
  } = useGetUsers({
    skip: getUrlLimits(searchParams).skip,
    limit: getUrlLimits(searchParams).limit,
    q: searchParams.get('q') || '',
  });

  const uniqueUserIds = useMemo(() => {
    if (!data?.data.users) return [];

    return Array.from(new Set(data.data.users.map((post) => post.id)));
  }, [data?.data.users]);

  // Removed manual refetch; query handles it automatically

  const usersQueries = useGetPostsUser(uniqueUserIds);

  const usersMap = useMemo(() => {
    const map = new Map<number, { postsTotal: number; likes: number }>();

    usersQueries.forEach((query, index) => {
      if (query.data?.data) {
        const userId = Number(uniqueUserIds[index]);
        const posts = query.data.data;

        map.set(userId, {
          postsTotal: posts.total,
          likes: posts.posts
            ? posts.posts.reduce((sum, post) => sum + post.reactions.likes, 0)
            : 0,
        });
      }
    });

    return map;
  }, [usersQueries, uniqueUserIds]);

  const onActionHandle = (id: string, actionKey: 'edit' | 'delete') => {
    const user = data?.data.users.find((user) => user.id === Number(id));

    setUserData(user);
    setAction(actionKey);
    if (user && actionKey === 'edit') {
      setValue('email', user.email);
      setValue('firstName', user.firstName);
      setValue('birthDate', formatDate(user.birthDate));
      onOpen();
    }
    if (user && actionKey === 'delete') {
      setValue('firstName', user.firstName);
      onOpen();
    }
  };

  const computedUsersData = useMemo(() => {
    if (!data?.data.users) return [];

    return data.data.users.map((user) => {
      const id = Number(user.id);
      const entry = usersMap.get(id);

      return {
        ...user,
        postsTotal: entry?.postsTotal ?? 0,
        likes: entry?.likes ?? 0,
      };
    });
  }, [data?.data.users, usersMap]);

  const areUserPostsReady = useMemo(() => {
    if (!uniqueUserIds.length) return true;
    if (usersQueries.length !== uniqueUserIds.length) return false;

    return usersQueries.every((q) => !!q.data?.data && !q.isLoading);
  }, [usersQueries, uniqueUserIds]);

  const lastUsersDataRef = useRef<any[]>([]);

  useEffect(() => {
    if (areUserPostsReady) {
      lastUsersDataRef.current = computedUsersData;
    }
  }, [areUserPostsReady, computedUsersData]);

  const displayedUsersData = areUserPostsReady
    ? computedUsersData
    : lastUsersDataRef.current;

  const isUsersLoading = !areUserPostsReady;
  const isLoading =
    loading ||
    isUsersLoading ||
    mutation.isPending ||
    mutationEdit.isPending ||
    mutationDelete.isPending;

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
          console.log('User created successfully', res);
          notifyServerAfterApi({
            type: 'success',
            message: 'User created successfully',
          });
          refetch(); // Refresh the list
          onOpenChange(); // Close modal
          reset();
          return true;
        },
        onError: (error) => {
          console.error('User creation error', error);
          notifyServerAfterApi({
            type: 'error',
            message: 'Failed to create user',
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
            console.log('User updated successfully', res);
            notifyServerAfterApi({
              type: 'success',
              message: 'User updated successfully',
            });
            refetch();
            onOpenChange();
            reset();
            setUserData({} as GetUserType);
            setAction('create');
          },
          onError: (error) => {
            console.error('User update error', error);
            notifyServerAfterApi({
              type: 'error',
              message: 'Failed to update user',
            });
          },
        }
      );
    }
    if (action === 'delete') {
      mutationDelete.mutate(userData?.id || 0, {
        onSuccess: (res) => {
          console.log('User deleted successfully', res);
          notifyServerAfterApi({
            type: 'success',
            message: 'User deleted successfully',
          });
          refetch();
          onOpenChange();
          reset();
          setUserData({} as GetUserType);
          setAction('create');
        },
        onError: (error) => {
          console.error('User delete error', error);
          notifyServerAfterApi({
            type: 'error',
            message: 'Failed to delete user',
          });
        },
      });
    }
  };

  return (
    <div className="flex pt-[88px] flex-col w-full h-full items-start justify-start sm:px-20 sm:pt-20 gap-3 sm:gap-10 hide-scrollbar">
      <PostsHeadComponent
        description="Управление пользователями системы"
        hasButton={{
          contentStart: <AddCircleIcon className="min-w-5" />,
          text: 'Добавить пользователя',
        }}
        placeholder="Поиск по пользователям"
        title="Пользователи"
        value={searchParams.get('q') || ''}
        onChange={debouncedSearch}
        onPress={onOpen}
      />
      <AdminsTable
        columnKeys={usersHeaderColumns}
        data={displayedUsersData || []}
        label="Пользователи"
        isLoading={isLoading}
        limit={getUrlLimits(searchParams).limit}
        onAction={onActionHandle}
      />
      <div className="flex sm:hidden flex-col w-full h-full [&>*:first-child]:rounded-t-[20px] [&>*:last-child]:pb-10">
        {displayedUsersData.map((userInfo, i) => {
          return <UserCard key={i} item={userInfo} onAction={onActionHandle} />;
        })}
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
        isLoading={isLoading}
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
