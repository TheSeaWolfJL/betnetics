export const signInformFields = [
  {
    name: 'username',
    placeholder: 'admin@example.com',
    label: 'Имя пользователя',
  },
  {
    name: 'password',
    placeholder: 'Введите пароль',
    label: 'Пароль',
  },
];

export const emailValidationRegex = /^[^|$%&/=?^*+!#~'{}]+$/i;
export const passwordValidationRegex =
  /^[A-Za-z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-=/\\|'“`"]+$/;

export const emailDomainRegex = /^[A-Za-z0-9]+$/;
export const emailDomainNumberRegex = /^[^\d]*$/;
export const emailSubdomainRegex = /^[A-Za-z0-9]+$/;
