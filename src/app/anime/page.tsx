import React from 'react';
import { AnimeSearchInput } from '@/features/anime/components/AnimeSearchInput';
import { AnimeGridQuery } from '@/features/anime/components/AnimeGridQuery';
import { mockAnime } from '@/features/anime/data/mockAnime';
import { AnimeFiltersBar } from '@/features/anime/components/AnimeFiltersBar';
import { AnimeSortBlock } from '@/features/anime/components/AnimeSortBlock';
import { fetchAnimeList } from '@/features/anime/api/animeService';

export const revalidate = 300; // пример публичного кеша

// In Next.js 15 searchParams can be provided as a Promise in type defs; support both.
export default async function AnimeListPage(
  props: { searchParams?: Record<string, string | undefined> | Promise<Record<string, string | undefined>> }
) {
  const sp = props.searchParams instanceof Promise ? await props.searchParams : (props.searchParams || {});
  const limit = 24;
  const page = Math.max(1, Number(sp.page || '1') || 1);
  let anime = mockAnime;
  let total = 0;
  try {
    const { items, total: totalCount } = await fetchAnimeList(limit, page);
    if (items.length) anime = items;
    total = totalCount;
  } catch {
    // fallback already set
  }
  return (
    <main className="mx-auto w-full max-w-[1650px] px-5 py-10">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-[40px]">
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <div className="flex flex-col gap-4">
            <AnimeSearchInput />
            <AnimeFiltersBar />
          </div>
          {/* Сетка (гидрация + client refetch) */}
          <AnimeGridQuery initial={anime} initialTotal={total} page={page} limit={limit} />
        </div>
        {/* Боковая панель */}
        <div className="shrink-0 w-full max-w-[288px]">
          <AnimeSortBlock />
        </div>
      </div>
    </main>
  );
}
