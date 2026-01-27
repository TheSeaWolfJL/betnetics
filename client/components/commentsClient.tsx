'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ItemType, PostCard } from './postCard';
import { CommentsTable } from './tables/commentsTable';
import { PostsHeadComponent } from './pageHeadComponent';

import {
  useGetPostComments,
  useGetPostsUsers,
} from '@/shared/api-services/posts/postsApi';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { commentsHeaderColumns } from '@/shared/constants';
import { getUrlLimits } from '@/shared/utils/urlLimitUtils';
import { useInitializeUrlParams } from '@/shared/hooks/useInitializeUrlParams';

const defaultParams = {
  skip: '0',
  limit: '12',
};

export default function CommentsPage(props: { id: string }) {
  const nextRouter = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, isPending, isLoading } = useGetPostComments(props.id, {
    skip: getUrlLimits(searchParams).skip,
    limit: getUrlLimits(searchParams).limit,
    q: searchParams.get('q') || '',
  });

  useInitializeUrlParams(defaultParams);

  const uniqueUserIds = useMemo(() => {
    if (!data?.data.comments) return [];

    return Array.from(
      new Set(data.data.comments.map((comment) => comment.user.id))
    );
  }, [data?.data.comments]);
  const usersQueries = useGetPostsUsers(uniqueUserIds);

  const usersMap = useMemo(() => {
    const map = new Map<number, { image: string; name: string }>();

    usersQueries.forEach((query, index) => {
      if (query.data?.data) {
        const userId = uniqueUserIds[index];
        const user = query.data.data;

        map.set(userId, {
          name: `${user.firstName} ${user.lastName.charAt(0) + '.'}`,
          image: user.image,
        });
      }
    });

    return map;
  }, [usersQueries, uniqueUserIds]);

  const isUsersLoading = usersQueries.some((query) => query.isLoading);
  const isLoadingData = isLoading || isPending || isUsersLoading;

  const debouncedSearch = useDebounce((search: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('q', search);
    const queryString = params.toString();

    nextRouter.replace(`${pathname}?${queryString}`);
  }, 300);
  const backFn = () => nextRouter.back();

  return (
    <>
      <PostsHeadComponent
        description={'fewfew'}
        fallbackLink={{
          title: 'Назад к списку публикаций',
          back: backFn,
        }}
        placeholder="Поиск по комментариям"
        title="Комментарии к посту"
        value={searchParams.get('q') || ''}
        onChange={debouncedSearch}
      />
      <CommentsTable
        columnKeys={commentsHeaderColumns}
        data={
          data?.data.comments?.map((comment) => {
            return {
              comments: comment.body,
              userId: usersMap.get(comment.user.id) || {
                name: 'false',
                image: 'falseImage',
              },
            };
          }) || []
        }
        isLoading={isLoadingData}
        label="Публикации"
        nonSort={commentsHeaderColumns.map((el) => el.key)}
      />

      <div className="flex sm:hidden flex-col w-full h-full">
        {data?.data.comments?.map((comment, i) => {
          return (
            <PostCard
              key={i}
              index={i}
              item={
                {
                  title: comment.body,
                  userId: usersMap.get(comment.user.id) || {
                    name: 'false',
                    image: 'falseImage',
                  },
                } as ItemType
              }
            />
          );
        })}
        {!data?.data.comments.length && <>Посты не найдены</>}
      </div>
    </>
  );
}
