import React from 'react';
import { AnimeCard, type AnimeCardProps } from './AnimeCard';

export function AnimeGrid({ items }: { items: AnimeCardProps[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
      {items.map(anime => (
        <AnimeCard key={anime.id} {...anime} />
      ))}
    </div>
  );
}
