import { SignInFormType, UserProfileResponseType, UserProfileType } from "@/types";
import { instance } from "../baseApi";
import { useQuery } from "@tanstack/react-query";

const enum Auth {
    login = 'auth/login',
    refresh = 'auth/refresh',
    me = 'auth/me'
}

const authApi = {
    signInAction(data: SignInFormType) {
        return instance.post<SignInFormType, { data: UserProfileType }>(Auth.login, data);
    },
    refreshToken() {
        return instance.post(Auth.refresh);
    },
    me() {
        return instance.get<UserProfileResponseType>(Auth.me);
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

const useGetAuth = () => {
    return useQuery({
        queryKey: ['auth'],
        queryFn: async () =>
            await authApi.me().then((res) => {
                return res.data;
            }),
    });
};

export { authApi, useGetAuth };
