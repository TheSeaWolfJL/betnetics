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
  updateMe(data: any) {
    return instance.put(Auth.me, data);
  },
  changePassword(data: { currentPassword: string; newPassword: string }) {
    return instance.put(`${Auth.me}/password`, data);
  },
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
