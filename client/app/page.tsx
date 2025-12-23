'use client'


import { setCookie } from 'cookies-next';
import { SignInFormType } from "@/types";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { LogoIcon } from "@/components/icons";
import { useAppStore } from '@/store/app-store';
import { useMutation } from "@tanstack/react-query";
import { signInformFields } from "@/shared/constants";
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from "@/shared/api-services/auth/authApi";
import { addToast, Button, Card, CardBody, Form, Input } from "@heroui/react";
import { signInSchema } from '@/shared/schema/signInSchema';

export default function SignIn() {
  const { setAuth } = useAppStore()
  const nextRouter = useRouter();
  const mutation = useMutation({
    mutationFn: (formData: SignInFormType) => authApi.signInAction(formData),
  });
  
  const {
    clearErrors,
    formState: { errors },
    setError,
  } = useForm<SignInFormType>({
    mode: 'onSubmit',
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  });

  const processForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors()
    const { error, data } = signInSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (error) error._zod.def.forEach(el => setError(el.path[0] as keyof SignInFormType, { type: el.message }))
    if (data) {
      mutation.mutate(data, {
        onSuccess: (res) => {
          setAuth(true);
          setCookie('accessToken', res.data.accessToken)
          setCookie('refreshToken', res.data.refreshToken)
          addToast({
            title: "Login",
            description: "Login was successfully",
            color: "success",
          })
          nextRouter.push('/posts');
        },
        onError: (error) => {
          addToast({
            title: "Login error",
            description: `Попробуйте другие логин \ пароль`,
            color: "danger",
          })
        },
      });
    }

  };

  const FormLabel = () => {
    return (
      <div className="flex w-full flex-col justify-center items-center gap-2 sm:gap-5">
        <span className="text-xl sm:text-4xl tracking-(--tracking-tight) font-semibold">Панель администратора</span>
        <span className="text-sm sm:text-lg text-(--text-subtext)">Войдите в систему для продолжения</span>
      </div>)
  }

  return (
    <div className='flex sm:items-center sm:justify-center w-full h-full gap-5 flex-col items-center justify-start'>
      <Card shadow="none" className='flex sm:hidden w-full rounded-none rounded-b-[20px] justify-center h-18 items-center'>
        <LogoIcon width={100} height={25} className="min-h-[25px] text-(--color-primary)" />
      </Card>
      <Card shadow="none" className="flex rounded-b-none rounded-t-[12px] sm:rounded-4xl w-full h-full max-w-[565px] max-h-full sm:max-h-[569px] px-5 sm:px-15">
        <CardBody className="flex w-full h-full items-center flex-col gap-5 sm:gap-10 p-0 pt-6 sm:pt-15">
          <LogoIcon width={100} height={25} className="sm:flex hidden min-h-[25px] text-(--color-primary)" />
          <FormLabel />
          <Form className="flex flex-col gap-5 sm:gap-10 w-full h-full" onSubmit={processForm} validationBehavior="aria">
            <div className="flex w-full flex-col gap-7 sm:gap-8">
              {signInformFields.map((el, i) => {
                return <Input
                  label={el.label}
                  key={i}
                  name={el.name as keyof SignInFormType}
                  labelPlacement="outside"
                  placeholder={el.placeholder}
                  className="flex relative rounded-xl"
                  variant="bordered"
                  classNames={{
                    label: "text-(--text-subtext) tracking-[-0.09em]",
                    helperWrapper: 'absolute top-8 sm:top-10',
                    innerWrapper: 'max-h-[32px] sm:max-h-[40px]',
                    inputWrapper: 'max-h-[32px] sm:max-h-[40px] min-h-[32px] sm:min-h-[40px] sm:h-[42px]'
                  }}
                  color={errors[el.name as keyof SignInFormType]?.type ? 'danger' : 'default'}
                  type={el.name === "password" ? "password" : "text"}
                  errorMessage={errors[el.name as keyof SignInFormType]?.type}
                  isInvalid={!!errors[el.name as keyof SignInFormType]?.type}
                />
              })}
            </div>
            <Button color="primary" className="w-full text-medium h-10 sm:h-12" type="submit" isLoading={mutation.isPending}>Войти</Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
