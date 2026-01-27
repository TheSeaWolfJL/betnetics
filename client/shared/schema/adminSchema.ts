import * as z from 'zod';

export const adminSchema = z.object({
  email: z.string().email('Неверный формат email, должен содержать @'),
  firstName: z
    .string()
    .min(2, 'Полное имя не меньше 2 символов')
    .max(50, 'Полное имя не больше 50 символов'),
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
});
