import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface AnimeCardProps {
  id: string;
  title: string;
  year?: number;
  kind?: string; // ONA / TV / Film / etc
  score?: number;
  poster?: string; // external url
  href?: string;
}

export function AnimeCard({ id, title, year, kind, score, poster, href }: AnimeCardProps) {
  const link = href || `/anime/${id}`;
  return (
    <div className="group relative flex w-full flex-col gap-2" data-state="closed">
      <div
        data-radix-aspect-ratio-wrapper=""
        style={{ position: 'relative', width: '100%', paddingBottom: '142.857%' }}
      >
        <div
          className="relative w-full overflow-hidden rounded-[14px] bg-muted"
          style={{ position: 'absolute', inset: 0 }}
        >
          <Link
            href={link}
            className="absolute left-0 top-0 flex size-full items-center justify-center  bg-secondary/20"
          >
            {poster && (
              <Image
                src={poster}
                alt={title || 'Poster'}
                fill
                sizes="(max-width: 768px) 50vw, (max-width:1200px) 25vw, 196px"
                priority={false}
                className="opacity-100 !transition size-full object-cover"
              />
            )}
          </Link>
        </div>
      </div>
      <Link href={link} className="mt-1 truncate">
        <label className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer leading-5">
          {title}
        </label>
        {(year || kind) && (
          <div className="mt-1 flex cursor-pointer items-center gap-2">
            {year && (
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-xs text-muted-foreground">
                {year}
              </label>
            )}
            {year && kind && <div className="size-1 rounded-full bg-muted-foreground" />}
            {kind && (
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-xs text-muted-foreground">
                {kind}
              </label>
            )}
          </div>
        )}
      </Link>
    </div>
  );
}
