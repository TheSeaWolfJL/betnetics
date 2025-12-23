import * as z from 'zod';

export const signInSchema = z.object({
    username: z.string().min(2, "Имя пользователя не меньше 2 символов").max(20, "Имя пользователя не больше 20 символов"),
    password: z.string().min(6, "Пароль не меньше 6 символов").max(20, "Пароль не больше 20 символов"),
});