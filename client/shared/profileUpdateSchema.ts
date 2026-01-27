import { z } from 'zod';

/**
 * Enumeration of user roles used throughout the application.
 *
 * @enum Roles
 */
export enum Roles {
  admin = 'admin',
  moderator = 'moderator',
  user = 'user',
}

export const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: 'Имя обязательно' }),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Дата должна быть в формате YYYY-MM-DD',
    })
    .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: 'Неверный формат даты',
    }),

  email: z.string().email({ message: 'Введите корректный e‑mail' }),

  age: z
    .number()
    .int()
    .min(0, { message: 'Возраст не может быть отрицательным' })
    .max(150, { message: 'Неверный возраст' }),

  role: z.enum(Roles, {
    message: 'Выберите корректную роль',
  }),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
