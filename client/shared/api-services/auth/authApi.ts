import { useQuery } from '@tanstack/react-query';

import { instance } from '../baseApi';

import { SignInFormType, TokensType, UserProfileType } from '@/types';

const enum Auth {
  login = 'auth/login',
  refresh = 'auth/refresh',
  me = 'auth/me',
}

const authApi = {
  signInAction(data: SignInFormType) {
    return instance.post<SignInFormType, { data: UserProfileType }>(
      Auth.login,
      data
    );
  },
  refreshToken(refreshToken: string) {
    return instance.post<{ refreshToken: string }, { data: TokensType }>(
      Auth.refresh,
      { refreshToken }
    );
  },
  me(accessToken: string, refreshToken: string) {
    let result = instance.get<UserProfileType>(Auth.me, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return result;
  },
  // updateMe(data: FormData) {
  //     return instance.patch(`${base + '/me'}`, data, {
  //         headers: { 'Content-Type': 'multipart/form-data; boundary=AaB03x' },
  //     });
  // },
  // logout() {
  //     return null
  // },
};

const useGetAuth = (accessToken: string, refreshToken: string) => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () =>
      await authApi.me(accessToken, refreshToken).then((res) => {
        return res.data;
      }),
  });
};

export { authApi, useGetAuth };
