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
    .regex(
      /^\d{2}\.\d{2}\.\d{4}$/,
      'Дата должна быть в формате ДД.ММ.ГГГГ (например: 19.09.1990)'
    )
    .refine((dateStr) => {
      const [day, month, year] = dateStr.split('.').map(Number);
      const date = new Date(year, month - 1, day);

      // Check if the date is valid
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        return false;
      }

      const now = new Date();
      const oneYearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      const oneHundredTwentyYearsAgo = new Date(
        now.getFullYear() - 120,
        now.getMonth(),
        now.getDate()
      );

      return date <= oneYearAgo && date >= oneHundredTwentyYearsAgo;
    }, 'Дата рождения должна быть между 1 годом и 120 годами от текущей даты'),
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
