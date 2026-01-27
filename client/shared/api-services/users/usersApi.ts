import { useQueries, useQuery } from '@tanstack/react-query';

import { instance } from '../baseApi';

import { AdminFormType, GetUsersType, GetUserType, PostsType } from '@/types';

const enum Users {
  users = 'users/',
  create_user = 'users/add',
}

type ParamsType = {
  skip: string;
  limit: string;
  q: string;
  key?: string;
  value?: string;
};

const usersApi = {
  getUsers(params: ParamsType) {
    return instance.get<GetUsersType>(
      `${Users.users}${params.key ? 'filter' : ''}${params.q && !params.key ? 'search?' : ''}`,
      { params }
    );
  },
  addUser(data: AdminFormType) {
    return instance.post<GetUserType, { data: AdminFormType }>(
      Users.create_user,
      data
    );
  },
  getUserPostsById(userId: number) {
    return instance.get<PostsType>(Users.users + userId + '/posts');
  },
};

const useGetUsers = (params: ParamsType) => {
  return useQuery({
    queryKey: ['users', params.limit, params.skip, params.q],
    queryFn: async () =>
      await usersApi.getUsers(params).then((res) => {
        return res;
      }),
    enabled: false,
  });
};

const useGetPostsUser = (usersId: number[]) =>
  useQueries({
    queries: usersId.map((id) => ({
      queryKey: ['users', id],
      queryFn: async () =>
        await usersApi.getUserPostsById(id).then((res) => {
          return res;
        }),
      enabled: usersId.length > 0,
    })),
  });

export { usersApi, useGetUsers, useGetPostsUser };
