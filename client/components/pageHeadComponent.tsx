import React from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

import { ArrowIcon, SearchIcon } from '@/components/icons';

type PostsHeadComponentType = {
  title: string;
  value: string;
  description: string;
  placeholder: string;
  hasButton?: { contentStart?: React.ReactNode; text?: string };
  onChange: (value: string) => void;
  onPress?: () => void;
  fallbackLink?: { back: () => void; title: string };
};

export const PostsHeadComponent = (props: PostsHeadComponentType) => {
  return (
    <div className="flex flex-col w-full gap-1 sm:gap-5 px-5 sm:px-0">
      {props.fallbackLink && (
        <div className="flex items-center gap-4">
          <div className="cursor-pointer" onClick={props.fallbackLink.back}>
            <ArrowIcon className="max-w-[20px] w-5" />
          </div>
          <span>{props.fallbackLink.title}</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between gap-2 pb-5 sm:pb-0">
        <div className="flex flex-col gap-2 sm:gap-5">
          <h1 className="text-xl sm:text-4xl tracking-(--tracking-tight) font-semibold">
            {props.title}
          </h1>

          <p className="text-sm sm:text-lg text-(--text-subtext)">
            {props.description}
          </p>
        </div>
        {props.hasButton && (
          <Button
            color="primary"
            startContent={props.hasButton.contentStart}
            onPress={props.onPress}
          >
            {props.hasButton.text}
          </Button>
        )}
      </div>
      <Input
        classNames={{
          label: 'text-black/50',
          input: [
            'text-black/90',
            'placeholder:text-default-700/50 dark:placeholder:text-white/60',
          ],
          innerWrapper: 'bg-transparent max-h-[32px] sm:max-h-[40px]',
          inputWrapper: [
            'w-full border-none sm:border max-h-[32px] sm:max-h-[40px] min-h-[32px] sm:min-h-[40px] sm:h-[42px]',
            'max-w-[746px]',
            'bg-white',
            'backdrop-blur-xl',
            'backdrop-saturate-200',
            'group-data-[focus=true]:bg-white',
            'cursor-text!',
          ],
        }}
        placeholder={props.placeholder}
        radius="lg"
        startContent={
          <SearchIcon className="mb-0.5 text-slate-400 pointer-events-none shrink-0" />
        }
        variant="bordered"
        onChange={(e) => {
          props.onChange(String(e.currentTarget.value));
        }}
      />
    </div>
  );
};
