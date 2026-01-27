import * as z from 'zod';

export const signInSchema = z.object({
  username: z
    .string()
    .min(2, 'Имя пользователя не меньше 2 символов')
    .max(20, 'Имя пользователя не больше 20 символов')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(2, 'Пароль должен содержать минимум 2 символов')
    .max(100, 'Пароль не должен превышать 100 символов'),
});
