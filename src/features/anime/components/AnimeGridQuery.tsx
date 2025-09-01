"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchAnimeList, type AdaptedAnimeCard } from '@/features/anime/api/animeService';
import { AnimeGrid } from './AnimeGrid';
import { AnimeListError } from './AnimeListError';

interface AnimeGridQueryProps {
  initial: AdaptedAnimeCard[];
  initialTotal?: number;
  page?: number;
  limit?: number;
}

export function AnimeGridQuery({ initial, initialTotal = 0, page = 1, limit = 60 }: AnimeGridQueryProps) {
  const [forceError, setForceError] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const qc = useQueryClient();
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['anime', 'list', { page, limit }],
    queryFn: async () => {
      if (forceError) throw new Error('Forced error');
      const res = await fetchAnimeList(limit, page);
      return res;
    },
    initialData: { items: initial, total: initialTotal },
    select: d => d,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev => prev ?? { items: initial, total: initialTotal }),
  });

  const items = (data?.items && data.items.length > 0)
    ? data.items
    : (page === 1 ? initial : []);
  const total = data?.total ?? initialTotal;
  const totalPages = total && limit ? Math.max(1, Math.ceil(total / limit)) : 1;

  // Smooth transition state: keep previous items while fading out, then swap & fade in
  const [displayItems, setDisplayItems] = useState(items);
  const [phase, setPhase] = useState<'idle' | 'fading-out' | 'fading-in'>('idle');
  const transitionTimeoutRef = useRef<number | null>(null);

  // Compare current displayed ids with incoming items ids
  useEffect(() => {
    if (!items || items.length === 0) return; // skip when no items (avoid flicker)
    const sameLength = displayItems.length === items.length;
    const sameIds = sameLength && displayItems.every((d, i) => d.id === items[i].id);
    if (sameIds) return; // nothing to animate
    // Start fade-out of current list
    setPhase('fading-out');
    // After fade-out duration, swap items and fade-in
    const outDuration = 160; // ms
    const inDuration = 220; // ms
    if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = window.setTimeout(() => {
      setDisplayItems(items);
      setPhase('fading-in');
      transitionTimeoutRef.current = window.setTimeout(() => {
        setPhase('idle');
      }, inDuration);
    }, outDuration);
    return () => {
      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
    };
  }, [items, displayItems]);

  // Prefetch next page
  useEffect(() => {
    if (page < totalPages) {
      const next = page + 1;
      qc.prefetchQuery({
        queryKey: ['anime', 'list', { page: next, limit }],
        queryFn: async () => fetchAnimeList(limit, next),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [page, totalPages, limit, qc]);

  function goTo(p: number, opts: { preserveScroll?: boolean } = {}) {
    const sp = new URLSearchParams(params?.toString());
    if (p <= 1) sp.delete('page'); else sp.set('page', String(p));
    router.push(`/anime?${sp.toString()}`);
    // scroll top of grid smoothly
    if (!opts.preserveScroll && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const paginationButtons = [] as React.ReactNode[];
  // Windowed pagination: first, prev dots, window, next dots, last
  const fetching = isFetching || isLoading;
  function addButton(label: string | number, p: number, active = false, disabled = false) {
    paginationButtons.push(
      <button
        key={`${label}-${p}`}
        disabled={disabled || active || fetching}
        onClick={() => goTo(p)}
        aria-current={active ? 'page' : undefined}
        className={
          'h-9 min-w-9 px-3 rounded-md text-sm font-medium transition-colors ' +
          (active
            ? 'bg-[#c8c7ca] text-[#060606] cursor-default'
            : 'bg-[rgba(255,255,255,0.02)] text-white hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed')
        }
      >
        {label}
      </button>,
    );
  }
  function addEllipsis(key: string) {
    paginationButtons.push(
      <span key={key} className="h-9 min-w-9 px-2 flex items-center justify-center text-sm text-muted-foreground">…</span>,
    );
  }
  if (totalPages > 1) {
    addButton('‹', Math.max(1, page - 1), false, page === 1);
    const windowSize = 2;
    const start = Math.max(1, page - windowSize);
    const end = Math.min(totalPages, page + windowSize);
    if (start > 1) {
      addButton(1, 1, page === 1);
      if (start > 2) addEllipsis('pre');
    }
    for (let p = start; p <= end; p++) addButton(p, p, p === page);
    if (end < totalPages) {
      if (end < totalPages - 1) addEllipsis('post');
      addButton(totalPages, totalPages, page === totalPages);
    }
    addButton('›', Math.min(totalPages, page + 1), false, page === totalPages);
  }

  // Jump input state
  const [jumpValue, setJumpValue] = useState('');
  function handleJumpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(jumpValue);
    if (!Number.isNaN(num) && num >= 1 && num <= totalPages) {
      goTo(num);
      setJumpValue('');
    }
  }

  // Hidden trigger methods: query param ?forceError=1 OR window.__animeForceError()
  useEffect(() => {
    if (params?.get('forceError') === '1') setForceError(true);
    // expose helper for console usage in dev
    if (process.env.NODE_ENV === 'development') {
      // @ts-expect-error attach to window for manual QA
      window.__animeForceError = () => setForceError(true);
      // @ts-expect-error reset helper
      window.__animeResetError = () => { setForceError(false); refetch(); };
    }
  }, [params, refetch]);

  const handleReset = () => { setForceError(false); refetch(); };

  return (
    <div className="flex flex-col gap-6" data-anime-grid-root>
      {/* Top spacer could host future filters; removed previous sticky top bar for new bottom design */}
      {isError ? (
        <AnimeListError message={(error as Error).message} onRetry={handleReset} />
      ) : items.length > 0 ? (
        <>
          <div
            className={
              'transition-opacity duration-200 ' +
              (phase === 'fading-out' ? 'opacity-0' : 'opacity-100')
            }
          >
            <AnimeGrid
              items={displayItems}
              loading={(isLoading || isFetching) && !(displayItems && displayItems.length)}
            />
          </div>
          {page < totalPages && (
            <div className="flex justify-center mt-2">
              <button
                type="button"
                disabled={fetching}
                onClick={() => goTo(page + 1, { preserveScroll: true })}
                className="inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-12 px-4 py-2 bg-[rgba(255,255,255,0.02)] text-white hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-40"
              >
                Показати ще
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full rounded-xl bg-muted/40 py-14 flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-medium opacity-70">Нет результатов для выбранных параметров</p>
          <button
            type="button"
            onClick={() => goTo(1)}
            className="h-9 px-4 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80"
          >
            Сбросить
          </button>
        </div>
      )}
      {totalPages > 1 && !isError && (
        <div className="sticky bottom-4 z-10 flex items-center w-fit mx-auto">
          <div className="relative flex rounded-lg p-3 bg-[#060606]/60 flex-row gap-2 backdrop-blur-xl shadow-sm ring-1 ring-white/10">
            <div className="flex w-full justify-center gap-2 items-center flex-wrap">
              {/* Prev button duplicate (first element already prev) omitted */}
              {paginationButtons.map(btn => btn)}
              {/* Jump input */}
              <form onSubmit={handleJumpSubmit} className="inline-flex">
                <input
                  className="flex rounded-lg px-3 py-2 text-sm ring-offset-background placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40 bg-[rgba(255,255,255,0.05)] size-9 border-none text-center sm:size-10 w-14 text-white"
                  placeholder="..."
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value.replace(/[^0-9]/g, ''))}
                  aria-label="Перейти к странице"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
