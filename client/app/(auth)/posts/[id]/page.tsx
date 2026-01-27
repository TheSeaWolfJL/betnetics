import { redirect, RedirectType } from 'next/navigation';

import CommentsPage from '@/components/commentsClient';

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  if (Number.isNaN(Number(id))) redirect('/posts', RedirectType.push);

  return (
    <div className="flex pt-[88px] flex-col w-full h-full items-start justify-start sm:px-20 sm:pt-20 gap-3 sm:gap-10 hide-scrollbar">
      <CommentsPage id={id} />
    </div>
  );
}
