import { getCookie } from "cookies-next";

export const getToken = (token: string) => getCookie(token) !== undefined ? getCookie(token) + '' : ''

