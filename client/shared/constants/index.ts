import { ColumnType } from '@/types';

export const emailValidationRegex = /^[^|$%&/=?^*+!#~'{}]+$/i;
export const passwordValidationRegex =
  /^[A-Za-z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-=/\\|'“`"]+$/;
export const emailDomainRegex = /^[A-Za-z0-9]+$/;
export const emailDomainNumberRegex = /^[^\d]*$/;

export const pageLimit = ['6', '9', '12'];

export function normalizeSkip(limit: string, skip: string) {
  if (Number.isNaN(Number(skip))) {
    return String(0);
  }
  if (!pageLimit.includes(String(limit))) {
    throw new Error(`limit must be one of ${pageLimit}`);
  }

  return String(Math.round(Number(skip) / Number(limit)) * Number(limit));
}

export const postHeaderColumns: Array<ColumnType> = [
  { label: 'ID', key: 'id', width: 'min-w-[112px] max-w-[112px] w-[112px]' },
  { label: 'Пост', key: 'title', width: 'min-w-[300px]' },
  {
    label: 'Автор',
    key: 'userId',
    width: 'min-w-[185px] max-w-[185px] w-[185px]',
  },
  {
    label: 'Просмотры',
    key: 'views',
    width: 'min-w-[142px] max-w-[142px] w-[142px] ',
  },
  {
    label: 'Лайки',
    key: 'reactions',
    width: 'min-w-[142px] max-w-[142px] w-[142px] ',
  },
  {
    label: 'Комментарии',
    key: 'comments',
    width: 'min-w-[142px] max-w-[142px] w-[142px] ',
  },
  { label: '', key: 'link', width: 'min-w-[80px] max-w-[80px] w-[80px]' },
];

export const commentsHeaderColumns: Array<ColumnType> = [
  { label: 'Комментарий', key: 'comments', width: 'min-w-auto grow' },
  {
    label: 'Автор',
    key: 'userId',
    width: 'min-w-[185px] max-w-[185px] w-[185px]',
  },
];

export const adminsHeaderColumns: Array<ColumnType> = [
  { label: 'Администратор', key: 'admins', width: 'min-w-[200px]' },
  {
    label: 'Email',
    key: 'email',
    width: 'min-w-[320px] max-w-[320px] w-[320px]',
  },
  {
    label: 'Дата рождения',
    key: 'birthDate',
    width: 'min-w-[230px] max-w-[230px] w-[230px]',
  },
  { label: 'Пол', key: 'sex', width: 'min-w-[160px] max-w-[160px] w-[160px]' },
  { label: '', key: 'actions', width: 'min-w-[144px] max-w-[144px] w-[144px]' },
];

export const usersHeaderColumns: Array<ColumnType> = [
  { label: 'Пользователь', key: 'admins', width: 'min-w-[364px]' },
  {
    label: 'Email',
    key: 'email',
    width: 'min-w-[260px] max-w-[260px] w-[260px]',
  },
  {
    label: 'Дата рождения',
    key: 'birthDate',
    width: 'min-w-[170px] max-w-[170px] w-[170px]',
  },
  { label: 'Пол', key: 'sex', width: 'min-w-[100px] max-w-[100px] w-[100px]' },
  {
    label: 'Посты',
    key: 'postsTotal',
    width: 'min-w-[120px] max-w-[120px] w-[120px]',
  },
  {
    label: 'Лайки',
    key: 'likes',
    width: 'min-w-[120px] max-w-[120px] w-[120px]',
  },
  {
    label: 'Комментарии',
    key: 'weight',
    width: 'min-w-[120px] max-w-[120px] w-[120px]',
  },
  {
    label: 'Роль',
    key: 'role',
    width: 'min-w-[130px] max-w-[130px] w-[130px]',
  },
  { label: '', key: 'actions', width: 'min-w-[88px] max-w-[88px] w-[88px]' },
];
