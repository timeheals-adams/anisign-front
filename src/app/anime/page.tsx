import React from 'react';
import { AnimeSearchInput } from '@/features/anime/components/AnimeSearchInput';
import { AnimeGrid } from '@/features/anime/components/AnimeGrid';
import { AnimeGridQuery } from '@/features/anime/components/AnimeGridQuery';
import { mockAnime } from '@/features/anime/data/mockAnime';
import { AnimeFiltersBar } from '@/features/anime/components/AnimeFiltersBar';
import { AnimeSortBlock } from '@/features/anime/components/AnimeSortBlock';
import { fetchAnimeList } from '@/features/anime/api/animeService';

export const revalidate = 300; // пример публичного кеша

export default async function AnimeListPage() {
  let anime = mockAnime;
  try {
    const { items } = await fetchAnimeList(60, 1);
    if (items.length) anime = items;
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
          <AnimeGridQuery initial={anime} />
        </div>
        {/* Боковая панель */}
        <div className="shrink-0 w-full max-w-[288px]">
          <AnimeSortBlock />
        </div>
      </div>
    </main>
  );
}
