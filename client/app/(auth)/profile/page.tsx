'use client';

import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, useForm } from 'react-hook-form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@heroui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Chip, useDisclosure } from '@heroui/react';

import { useAppStore } from '@/store/app-store';
import { postsApi } from '@/shared/api-services/posts/postsApi';
import { ageWithPlural, formatDate, isEqualDeep } from '@/shared/utils/utils';
import { AdminFormType, ProfileType } from '@/types';
import { InputForm } from '@/components/InputForm';
import {
  ProfileFormData,
  profileFormSchema,
  Roles,
} from '@/shared/schema/profileUpdateSchema';
import { SelectSortBy } from '@/components/selectSort';
import UserModal from '@/components/userModal';

type ExtendedProfileFormData = ProfileFormData & {
  currentPassword?: string;
  newPassword?: string;
};

const adminModalFields = [
  {
    name: 'currentPassword' as keyof AdminFormType,
    placeholder: 'Введите текущий пароль',
    label: 'Текущий пароль',
  },
  {
    name: 'newPassword' as keyof AdminFormType,
    placeholder: 'Введите новый пароль',
    label: 'Новый пароль',
    // type: 'password',
  },
];

const profileformFields = [
  {
    name: 'birthDate',
    placeholder: '01.10.1990',
    label: 'Дата рождения',
  },
  {
    name: 'firstName',
    placeholder: 'Алексеев Давид Иванович',
    label: 'ФИО',
  },
  {
    name: 'role',
    placeholder: Roles.user,
    label: 'Роль',
  },
  {
    name: 'email',
    placeholder: 'jrgarciadev@example.com',
    label: 'Email',
  },
] as const satisfies Array<{
  name: keyof ProfileType;
  placeholder: string;
  label: string;
}>;

export default function ProfilePage() {
  const { user, setUser } = useAppStore();
  const nextRouter = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mutation = useMutation({
    // mutationFn: (formData: SignInFormType) => authApi.signInAction(formData),
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    clearErrors,
    formState: { errors },
    setError,
    register,
    reset,
    trigger,
    getValues,
    setValue,
    control,
    unregister,
  } = useForm<ExtendedProfileFormData>({
    mode: 'onChange',
    defaultValues: {
      birthDate: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      role: Roles.user,
    },
    resolver: zodResolver(profileFormSchema),
  });
  const {
    data: fullUser,
    isPending,
    isLoading,
  } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: () => postsApi.getUserById(user!.id).then((res) => res.data),
    staleTime: 8000,
  });

  useEffect(() => {
    if (fullUser) {
      const birthDate = formatDate(fullUser.birthDate);

      setValue('birthDate', birthDate);
      setValue('age', fullUser.age);
      setValue('email', fullUser.email);
      setValue('role', fullUser.role);
      setValue('firstName', `${fullUser.firstName} ${fullUser.lastName}`);
      // setUser({ ...fullUser, accessToken: '', refreshToken: '' });
    }
  }, [fullUser, isPending, isLoading]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   // setFormData((prev) => ({
  //   //   ...prev,
  //   //   [name]: value,
  //   // }));
  // };

  const processForm = (payload: ExtendedProfileFormData) => {
    // mutation.mutate(payload, {
    //   onSuccess: (res) => {
    //     addToast({
    //       title: 'Login',
    //       description: 'Login was successfully',
    //       color: 'success',
    //     });
    //     nextRouter.push('/posts');
    //   },
    //   onError: (error) => {
    //     addToast({
    //       title: 'Login error',
    //       description: `Попробуйте другие логин \ пароль`,
    //       color: 'danger',
    //     });
    //   },
    // });
  };

  const handleOpenChange = () => {
    if (!!isOpen) {
      setValue('currentPassword', '');
      setValue('newPassword', '');
    }
    onOpenChange();
  };
  const loading = isPending || isLoading;

  return (
    <div className="flex pt-[68px] sm:pt-[88px] flex-col w-full h-full items-start justify-start sm:px-20 sm:pt-20 sm:gap-10 hide-scrollbar">
      <div className="flex w-full sm:max-h-[408px]">
        <div className="flex w-full sm:flex items-center flex-col sm:bg-white rounded-2xl gap-5 sm:gap-10 overflow-hidden sm:p-10 p-5">
          <div className="flex w-full flex-col gap-3 sm:gap-10 sm:flex-row">
            <div className="flex items-center justify-center sm:justify-start">
              <Avatar
                className="w-20 h-20 sm:w-[160px] sm:h-[160px]"
                src={fullUser?.image}
              />
            </div>
            <div className="flex w-full flex-col sm:flex-row justify-between">
              <div className="flex w-full flex-col items-center justify-center sm:items-start">
                <Chip
                  className="text-tiny "
                  color={fullUser?.role === 'admin' ? 'warning' : 'default'}
                  size="sm"
                >
                  {fullUser?.role === 'admin' ? 'Администратор' : 'Автор'}
                </Chip>
                <div className="flex flex-col items-center sm:items-start gap-1 sm:gap-3 pt-3 sm:pt-5 text-lg w-full">
                  <h1 className="sm:text-4xl font-bold">{`${fullUser?.firstName} ${fullUser?.lastName}`}</h1>
                  <div className="flex w-full items-center sm:justify-start justify-center">
                    <div className="overflow-hidden text-ellipsis sm:text-lg text-sm text-(--color-primary)">
                      {fullUser?.email}
                    </div>
                  </div>
                  <p className="sm:text-lg text-sm">
                    {formatDate(fullUser?.birthDate || '')}
                    <span className="text-sm sm:text-lg text-(--text-label)">
                      {ageWithPlural(fullUser?.age || 0)}
                    </span>
                  </p>
                </div>
              </div>
              <Button
                className="text-sm min-h-6 max-h-6 pt-2 sm:pt-0 text-(--color-primary) active:bg-transparent focus:bg-transparent data-[hover=true]:bg-transparent data-[pressed=true]:bg-transparent"
                variant="light"
                onPress={onOpen}
              >
                Изменить пароль
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Личные данные */}
      <div className="flex w-full sm:max-h-[408px]">
        <div className="flex w-full flex-col bg-white rounded-2xl gap-5 sm:gap-10 overflow-hidden sm:p-10 p-5">
          <div className="flex w-full">
            <h1 className="text-lg sm:text-2xl font-bold">Личные данные</h1>
          </div>

          {!loading && (
            <Form
              className="flex gap-5 flex-col sm:gap-10 w-full h-full"
              control={control}
              onSubmit={({ data }) => {
                processForm(data);
              }}
            >
              <div className="flex w-full flex-col sm:flex-row gap-4 sm:gap-8">
                <div className="flex w-full gap-4 sm:gap-7 flex-col sm:max-w-[492px]">
                  {profileformFields.map((el, i) => {
                    if ((i + 1) % 2 !== 0) return null;

                    return (
                      <InputForm
                        key={i}
                        el={{ ...el, value: getValues()[el.name] }}
                        errors={errors}
                        register={register}
                        trigger={trigger}
                      />
                    );
                  })}
                </div>
                <div className="flex gap-4 sm:gap-7 w-full flex-col sm:max-w-[492px]">
                  {profileformFields.map((el, i) => {
                    if (i === 2) {
                      return (
                        <SelectSortBy
                          key={i}
                          display
                          items={Object.values(Roles)}
                          label={el.label}
                          placeholder={Roles.user}
                          selectionChange={(id) => {
                            setValue('role', Object.values(Roles)[Number(id)]);
                            trigger('role');
                          }}
                          value={String(
                            Object.values(Roles).indexOf(getValues()['role'])
                          )}
                        />
                      );
                    }

                    if ((i + 1) % 2 === 0) return null;

                    return (
                      <InputForm
                        key={i}
                        el={{
                          ...el,
                          value: getValues()[el.name],
                        }}
                        errors={errors}
                        register={register}
                      />
                    );
                  })}
                </div>
              </div>
              <div>
                <Button
                  className="flex w-full sm:w-auto"
                  color="default"
                  isDisabled={
                    !!Object.keys(errors).length ||
                    isOpen ||
                    !!isEqualDeep(
                      fullUser
                        ? Object.fromEntries(
                          Object.keys(getValues()).map((key) => {
                            if (key === 'birthDate') {
                              return [key, formatDate(fullUser['birthDate'])];
                            }
                            if (key === 'firstName') {
                              return [
                                key,
                                `${fullUser['firstName']} ${fullUser['lastName']}`,
                              ];
                            }
                            if (key === 'currentPassword') {
                              return [key, ''];
                            }
                            if (key === 'newPassword') {
                              return [key, ''];
                            }

                            return [
                              key,
                              fullUser[key as keyof typeof fullUser],
                            ];
                          })
                        )
                        : null,
                      getValues()
                    )
                  }
                >
                  Сохранить изменения
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>

      <UserModal
        control={control}
        errors={errors}
        fields={adminModalFields}
        fullWidth={true}
        isLoading={mutation.isPending}
        isOpen={isOpen}
        processForm={processForm}
        register={register}
        trigger={trigger}
        actionButtons={{ closeButton: 'Отмена', actionButton: 'Сохранить' }}
        // isDisabled={
        //   (Object.values(getValues()).includes('') && action !== 'delete') ||
        //   !!Object.keys(errors).length ||
        //   Object.values({
        //     birthDate: formatDate(userData?.birthDate || ''),
        //     email: userData?.email || '',
        //     firstName: userData?.firstName || '',
        //   }).join('') === Object.values(getValues()).join('')
        // }
        // fields={action === 'delete' ? [] : adminModalFields}
        onOpenChange={handleOpenChange}
        // bodyTitle={
        //   action === 'delete'
        //     ? `${userData?.firstName} ${userData?.lastName}`
        //     : ''
        // }
        header="Изменение пароля"
        // actionButtons={modalHeaderTitle[action]}
        // avatar={{ className: 'w-30 h-30 text-large', image: userData?.image }}
      />
    </div>
  );
}
