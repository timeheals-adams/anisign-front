"use client";
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { fetchAnimeList, type AdaptedAnimeCard } from '@/features/anime/api/animeService';
import { AnimeGrid } from './AnimeGrid';
import { AnimeListError } from './AnimeListError';

interface AnimeGridQueryProps {
  initial: AdaptedAnimeCard[];
  page?: number;
  limit?: number;
}

export function AnimeGridQuery({ initial, page = 1, limit = 60 }: AnimeGridQueryProps) {
  const [forceError, setForceError] = useState(false);
  const params = useSearchParams();
  const qc = useQueryClient();
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['anime', 'list', { page, limit }],
    queryFn: async () => {
      if (forceError) throw new Error('Forced error');
      return (await fetchAnimeList(limit, page)).items;
    },
    initialData: initial,
    staleTime: 5 * 60 * 1000,
  });

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
  <div className="flex flex-col gap-4">
      {isError ? (
        <AnimeListError message={(error as Error).message} onRetry={handleReset} />
      ) : (
        <AnimeGrid
          items={data || []}
          loading={(isLoading || isFetching) && !(data && data.length)}
        />
      )}
    </div>
  );
}
