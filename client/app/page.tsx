'use client'

import * as z from 'zod';
import { SignInFormType } from "@/types";
import { useForm } from "react-hook-form";
import { LogoIcon } from "@/components/icons";
import { signInformFields } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api-services/auth/authApi";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, Form, Input } from "@heroui/react";

export default function SignIn() {
  const mutation = useMutation({
    mutationFn: (formData: SignInFormType) => authApi.signInAction(formData),
  });
  const schema = z.object({
    username: z.string().min(2, "Имя пользователя не меньше 2 символов").max(20, "Имя пользователя не больше 20 символов"),
    password: z.string().min(6, "Пароль не меньше 6 символов").max(20, "Пароль не больше 20 символов"),
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
    resolver: zodResolver(schema),
  });

  const processForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors()
    const { error, data } = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (error) error._zod.def.forEach(el => setError(el.path[0] as keyof SignInFormType, { type: el.message }))
    if (data) {
      mutation.mutate(data, {
        onSuccess: (res) => {
          // setAuth(true);
          console.log(res.data)
          // toastWrapper('login is success');
          // nextRouter.push('/decks');
        },
        onError: (error) => {
          // toastWrapper(error.message, true);
        },
      });
    }

  };

  const FormLabel = () => {
    return (
      <div className="flex w-full flex-col justify-center items-center gap-5">
        <span className="text-4xl tracking-(--tracking-tight) font-semibold">Панель администратора</span>
        <span className="text-lg text-(--text-subtext)">Войдите в систему для продолжения</span>
      </div>)
  }

  return (
    <div className='flex sm:items-center sm:justify-start w-full gap-5 h-full flex-col items-center justify-start'>
      <Card shadow="none" className='flex sm:hidden w-full rounded-none rounded-b-[20px] justify-center h-18 items-center'> <LogoIcon width={100} height={25} className="min-h-[25px] text-(--color-primary)" /></Card>
      <Card shadow="none" className="flex rounded-b-none rounded-t-[12px] sm:rounded-4xl w-full h-full max-w-[565px] max-h-[569px] px-15">
        <CardBody className="flex w-full h-full items-center flex-col gap-10 p-0 pt-15">
          <LogoIcon width={100} height={25} className="sm:flex hidden min-h-[25px] text-(--color-primary)" />
          <FormLabel />
          <Form className="flex flex-col gap-10 w-full h-full" onSubmit={processForm} validationBehavior="aria">
            <div className="flex w-full flex-col gap-8">
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
                    helperWrapper: 'absolute top-10',
                    inputWrapper: 'h-[42px]'
                  }}
                  color={errors[el.name as keyof SignInFormType]?.type ? 'danger' : 'default'}
                  type={el.name === "password" ? "password" : "text"}
                  errorMessage={errors[el.name as keyof SignInFormType]?.type}
                  isInvalid={!!errors[el.name as keyof SignInFormType]?.type}
                />
              })}
            </div>
            <Button color="primary" className="w-full text-medium h-12" type="submit" isLoading={mutation.isPending}>Войти</Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
