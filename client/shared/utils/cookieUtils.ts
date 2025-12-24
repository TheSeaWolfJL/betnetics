import { getCookie, setCookie } from 'cookies-next';

export const getToken = (token: string) =>
  getCookie(token) !== undefined ? getCookie(token) + '' : '';
export const updateTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  setCookie('refreshToken', refreshToken);
};
