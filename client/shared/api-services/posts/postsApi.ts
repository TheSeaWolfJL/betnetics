import { useQueries, useQuery } from '@tanstack/react-query';

import { instance } from '../baseApi';

import { GetUserType, PostCommentsType, PostsType } from '@/types';

const enum Posts {
  posts = 'posts/',
  users = 'users/',
  comments = 'comments/post/',
}

const postsApi = {
  getPosts(params: {
    limit: string;
    skip: string;
    sortBy: string;
    order: string;
    q: string;
  }) {
    if (params.q) {
      return instance.get<PostsType>(Posts.posts + 'search', { params });
    }

    return instance.get<PostsType>(Posts.posts, { params });
  },
  getPostComments(params: { limit: string; skip: string; sortBy: string }) {
    return instance.get<PostsType>(Posts.comments, { params });
  },
  getUserById(userId: number) {
    return instance.get<GetUserType>(Posts.users + userId);
  },
  getPostsCommentsById(postId: number) {
    return instance.get<PostCommentsType>(Posts.posts + postId + '/comments');
  },
  getPostCommentsById(
    postId: string,
    params: {
      limit: string;
      skip: string;
      q: string;
    }
  ) {
    return instance.get<PostCommentsType>(Posts.comments + postId, {
      params,
    });
  },
};

const useGetPosts = (params: {
  limit: string;
  skip: string;
  sortBy: string;
  order: string;
  q: string;
}) => {
  return useQuery({
    queryKey: [
      'posts',
      params.limit,
      params.skip,
      params.sortBy,
      params.order,
      params.q,
    ],
    queryFn: async () =>
      await postsApi.getPosts(params).then((res) => {
        return res;
      }),
  });
};

const useGetPostsUsers = (usersId: number[]) =>
  useQueries({
    queries: usersId.map((id) => ({
      queryKey: ['users', id],
      queryFn: async () =>
        await postsApi.getUserById(id).then((res) => {
          return res;
        }),
      enabled: usersId.length > 0,
    })),
  });

const useGetPostsComments = (postIds: number[]) =>
  useQueries({
    queries: postIds.map((postId) => ({
      queryKey: ['comments', postId],
      queryFn: async () =>
        await postsApi.getPostsCommentsById(postId).then((res) => {
          return res;
        }),
      enabled: postIds.length > 0,
    })),
  });
const useGetPostComments = (
  postId: string,
  params: {
    limit: string;
    skip: string;
    q: string;
  }
) => {
  return useQuery({
    queryKey: ['comments', postId, params.limit, params.skip, params.q],
    queryFn: async () =>
      await postsApi.getPostCommentsById(postId, params).then((res) => {
        return res;
      }),
    enabled: postId.length > 0,
  });
};

export {
  postsApi,
  useGetPosts,
  useGetPostsUsers,
  useGetPostsComments,
  useGetPostComments,
};
