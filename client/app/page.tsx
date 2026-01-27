'use client';

import { setCookie } from 'cookies-next';
import { Form, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { addToast, Button, Card, CardBody } from '@heroui/react';

import { SignInFormType } from '@/types';
import { LogoIcon } from '@/components/icons';
import { useAppStore } from '@/store/app-store';
import { authApi } from '@/shared/api-services/auth/authApi';
import { signInSchema } from '@/shared/schema/signInSchema';
import { InputForm } from '@/components/InputForm';
import notifyServerAfterApi from '@/shared/utils/notifyServerAfterApi';
import getSocket from '@/shared/socket';
import { useEffect } from 'react';

const signInformFields = [
  {
    name: 'username' as keyof SignInFormType,
    placeholder: 'admin@example.com',
    label: 'Имя пользователя',
  },
  {
    name: 'password' as keyof SignInFormType,
    placeholder: 'Введите пароль',
    label: 'Пароль',
  },
];

export default function SignIn() {
  const { setAuth, setUser } = useAppStore();
  const nextRouter = useRouter();
  const mutation = useMutation({
    mutationFn: (formData: SignInFormType) => authApi.signInAction(formData),
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

  const {
    formState: { errors },
    register,
    control,
  } = useForm<SignInFormType>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  });

  const processForm = (payload: SignInFormType) => {
    mutation.mutate(payload, {
      onSuccess: (res) => {
        setAuth(true);
        setCookie('accessToken', res.data.accessToken);
        setCookie('refreshToken', res.data.refreshToken);
        setUser(res.data);
        notifyServerAfterApi({
          type: 'success',
          message: 'Login was successfully',
        });
        nextRouter.push('/posts');
      },
      onError: (error) => {
        notifyServerAfterApi({
          type: 'error',
          message: 'Попробуйте другие логин \ пароль',
        });
      },
    });
  };

  const FormLabel = () => {
    return (
      <div className="flex w-full flex-col justify-center items-center gap-2 sm:gap-5">
        <h1 className="text-xl sm:text-4xl tracking-(--tracking-tight) font-semibold">
          Панель администратора
        </h1>
        <p className="text-sm sm:text-lg text-(--text-subtext)">
          Войдите в систему для продолжения
        </p>
      </div>
    );
  };

  return (
    <div className="flex items-center sm:justify-center w-full h-full gap-5 flex-col justify-start">
      <Card
        className="flex sm:hidden w-full rounded-none rounded-b-[20px] justify-center h-18 items-center"
        shadow="none"
      >
        <LogoIcon
          className="min-h-[25px] text-(--color-primary)"
          height={25}
          width={100}
        />
      </Card>
      <Card
        className="flex rounded-b-none rounded-t-[12px] sm:rounded-4xl w-full h-full max-w-[565px] max-h-full sm:max-h-[569px] px-5 sm:px-15"
        shadow="none"
      >
        <CardBody className="flex w-full h-full items-center flex-col gap-5 sm:gap-10 p-0 pt-6 sm:pt-15">
          <LogoIcon
            className="sm:flex hidden min-h-[25px] text-(--color-primary)"
            height={25}
            width={100}
          />
          <FormLabel />
          <Form
            className="flex flex-col gap-5 sm:gap-10 w-full h-full"
            control={control}
            onSubmit={({ data }) => {
              processForm(data);
            }}
          >
            <div className="flex w-full flex-col gap-7 sm:gap-8">
              {signInformFields.map((el, i) => {
                return (
                  <InputForm
                    key={i}
                    el={el}
                    errors={errors}
                    register={register}
                  />
                );
              })}
            </div>
            <Button
              className="w-full text-medium h-10 sm:h-12"
              color="primary"
              isLoading={mutation.isPending}
              type="submit"
            >
              Войти
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
