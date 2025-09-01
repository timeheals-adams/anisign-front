import React from 'react';
import { AnimeCard, type AnimeCardProps } from './AnimeCard';

function AnimeCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2 animate-pulse">
      <div
        data-radix-aspect-ratio-wrapper=""
        style={{ position: 'relative', width: '100%', paddingBottom: '142.857%' }}
      >
        <div
          className="relative w-full overflow-hidden rounded-[14px] bg-muted/40"
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>
      <div className="h-4 w-3/4 rounded bg-muted/40" />
      <div className="h-3 w-1/2 rounded bg-muted/30" />
    </div>
  );
}

export function AnimeGrid({ items, loading = false }: { items: AnimeCardProps[]; loading?: boolean }) {
  const show = loading ? Array.from({ length: 12 }).map((_, i) => <AnimeCardSkeleton key={i} />) : items.map(anime => <AnimeCard key={anime.id} {...anime} />);
  return <div className="group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">{show}</div>;
}
