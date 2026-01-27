'use client';

import { useMemo, useRef, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { PostType } from '@/types';
import { PostCard } from '@/components/postCard';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { SelectSortBy } from '@/components/selectSort';
import { useSortUrl } from '@/shared/hooks/useSortUrl';
import { getUrlLimits } from '@/shared/utils/urlLimitUtils';
import { PostsTable } from '@/components/tables/postsTable';
import { PostsHeadComponent } from '@/components/pageHeadComponent';
import {
  useGetPosts,
  useGetPostsUsers,
  useGetPostsComments,
} from '@/shared/api-services/posts/postsApi';
import { postHeaderColumns } from '@/shared/constants';
import { useInitializeUrlParams } from '@/shared/hooks/useInitializeUrlParams';
import { resolveSortIndex } from '@/shared/utils/utils';

const postsNotAllowedSortList = ['title', 'userId', 'link'];
const defaultParams = {
  skip: '0',
  limit: '12',
  order: 'asc',
  sortBy: 'id',
};

export default function PostsPage() {
  const nextRouter = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useInitializeUrlParams(defaultParams);

  const { data, isPending } = useGetPosts({
    skip: getUrlLimits(searchParams).skip || defaultParams.skip,
    limit: getUrlLimits(searchParams).limit || defaultParams.limit,
    order: searchParams.get('order') || defaultParams.order,
    sortBy: searchParams.get('sortBy') || defaultParams.sortBy,
    q: searchParams.get('q') || '',
  });

  const sortAllowedKeys = useMemo(
    () =>
      postHeaderColumns
        .filter((column) => !postsNotAllowedSortList.includes(column.key))
        .map((column) => column.key),
    [postsNotAllowedSortList]
  );
  const sortAllowList = useMemo(
    () =>
      postHeaderColumns.filter(
        (column) => !postsNotAllowedSortList.includes(column.key)
      ),
    [postsNotAllowedSortList]
  );
  const handleSortToUrl = useSortUrl(sortAllowedKeys);

  // Get unique user IDs and post IDs
  const uniqueUserIds = useMemo(() => {
    if (!data?.data.posts) return [];

    return Array.from(new Set(data.data.posts.map((post) => post.userId)));
  }, [data?.data.posts]);

  const uniquePostIds = useMemo(() => {
    if (!data?.data.posts) return [];

    return Array.from(new Set(data.data.posts.map((post) => post.id)));
  }, [data?.data.posts]);

  // Fetch users and comments
  const usersQueries = useGetPostsUsers(uniqueUserIds);
  const commentsQueries = useGetPostsComments(uniquePostIds);

  // Create maps for quick lookup
  const usersMap = useMemo(() => {
    const map = new Map<number, { image: string; name: string }>();

    usersQueries.forEach((query, index) => {
      if (query.data?.data) {
        const userId = uniqueUserIds[index];
        const user = query.data.data;

        map.set(userId, {
          name: `${user.firstName} ${user.lastName?.slice(0, 1) + '.'}`,
          image: user.image,
        });
      }
    });

    return map;
  }, [usersQueries, uniqueUserIds]);

  const commentsCountMap = useMemo(() => {
    const map = new Map<number, number>();

    commentsQueries.forEach((query, index) => {
      if (query.data?.data) {
        const postId = uniquePostIds[index];

        map.set(postId, query.data.data.total || 0);
      }
    });

    return map;
  }, [commentsQueries, uniquePostIds]);

  // Enrich posts data with user info and comments count (computed)
  const computedEnrichedPosts = useMemo(() => {
    if (!data?.data.posts) return [];

    return data.data.posts.map((post: PostType) => ({
      ...post,
      userId: usersMap.get(post.userId) || {
        name: 'false',
        image: 'falseImage',
      },
      comments: commentsCountMap.get(post.id) || 0,
    }));
  }, [data?.data.posts, usersMap, commentsCountMap]);

  const areUsersReady = useMemo(() => {
    if (!uniqueUserIds.length) return true;
    if (usersQueries.length !== uniqueUserIds.length) return false;

    return usersQueries.every((q) => !!q.data?.data && !q.isLoading);
  }, [usersQueries, uniqueUserIds]);

  const areCommentsReady = useMemo(() => {
    if (!uniquePostIds.length) return true;
    if (commentsQueries.length !== uniquePostIds.length) return false;

    return commentsQueries.every((q) => !!q.data?.data && !q.isLoading);
  }, [commentsQueries, uniquePostIds]);

  const areAllReady = areUsersReady && areCommentsReady;

  const lastEnrichedRef = useRef<any[]>([]);

  useEffect(() => {
    if (areAllReady) lastEnrichedRef.current = computedEnrichedPosts;
  }, [areAllReady, computedEnrichedPosts]);

  const displayedPosts = areAllReady
    ? computedEnrichedPosts
    : lastEnrichedRef.current;

  // Check if users/comments are still loading (based on readiness)
  const isUsersLoading = !areUsersReady;
  const isCommentsLoading = !areCommentsReady;
  const isLoading = isPending || isUsersLoading || isCommentsLoading;

  const debouncedSearch = useDebounce((search: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('q', search);
    const queryString = params.toString();

    nextRouter.replace(`${pathname}?${queryString}`);
  }, 300);
  const directionUrl = searchParams.get('order') === 'desc' ? 'desc' : 'asc';
  // let sortBy = String(
  //   sortAllowedKeys.indexOf(String(searchParams.get('sortBy')))
  // );
  // if (!sortAllowedKeys.includes(String(searchParams.get('sortBy')))) {
  //   sortBy = '0';
  // }
  const sortBy = resolveSortIndex(searchParams.get('sortBy'), sortAllowedKeys);

  return (
    <div className="flex pt-[88px] flex-col w-full h-full items-start justify-start sm:px-20 sm:pt-20 gap-3 sm:gap-10 hide-scrollbar">
      <PostsHeadComponent
        description="Управление публикациями пользователей"
        placeholder="Поиск по публикациям"
        title="Публикации"
        value={searchParams.get('q') || ''}
        onChange={debouncedSearch}
      />
      <div className="flex sm:hidden w-full h-full px-5">
        <SelectSortBy
          items={sortAllowList.map((el) => el.label)}
          label="Сортировать по"
          labelPlacement="outside-left"
          selectionChange={(id) => {
            const params = new URLSearchParams(searchParams.toString());

            params.set('sortBy', sortAllowedKeys[Number(id)]);
            params.set('order', defaultParams.order);
            const queryString = params.toString();

            nextRouter.push(`${pathname}?${queryString}`);
          }}
          value={sortBy}
        />
      </div>

      <PostsTable
        columnKeys={postHeaderColumns}
        currentSort={{
          sortBy: searchParams.get('sortBy') || '',
          direction: directionUrl,
        }}
        data={displayedPosts}
        isLoading={isLoading}
        label="Публикации"
        limit={getUrlLimits(searchParams).limit}
        nonSort={postsNotAllowedSortList}
        onSortChange={handleSortToUrl}
      />
      <div className="flex sm:hidden flex-col w-full h-full [&>*:first-child]:rounded-t-[20px] [&>*:last-child]:pb-10">
        {displayedPosts.map((postInfo, i) => {
          return <PostCard key={i} index={i} item={postInfo} />;
        })}
        {!data?.data.posts.length && !isLoading && <>Посты не найдены</>}
      </div>
    </div>
  );
}
