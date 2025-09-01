import { apiFetch } from '@/lib/apiClient';

// Raw API response shapes (simplified) based on provided sample
export interface RawAnimeItem {
  anime_id: string; // numeric string id
  id: string; // uuid
  english?: string | null;
  russian?: string | null;
  kind?: string | null; // e.g. 'ona'
  score?: number | null;
  poster_url?: string | null;
  aired_on?: string | null; // ISO date
  released_on?: string | null; // ISO date
}

interface RawAnimeListResponse {
  total_count: number;
  anime_list: RawAnimeItem[];
}

export interface AdaptedAnimeCard {
  id: string; // use anime_id
  title: string;
  year?: number;
  kind?: string;
  score?: number;
  poster?: string;
}

function extractYear(item: RawAnimeItem): number | undefined {
  const dateStr = item.aired_on || item.released_on;
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  const y = d.getFullYear();
  return Number.isNaN(y) ? undefined : y;
}

function normalizeKind(kind?: string | null): string | undefined {
  if (!kind) return undefined;
  switch (kind.toLowerCase()) {
    case 'tv': return 'TV';
    case 'movie': return 'Фильм';
    case 'ona': return 'ONA';
    case 'ova': return 'OVA';
    default: return kind.toUpperCase();
  }
}

export function adaptAnimeList(raw: RawAnimeItem[]): AdaptedAnimeCard[] {
  return raw.map(item => ({
    id: item.anime_id || item.id,
    title: item.russian || item.english || 'Без названия',
    year: extractYear(item),
    kind: normalizeKind(item.kind || undefined),
    score: typeof item.score === 'number' ? Number(item.score.toFixed(2)) : undefined,
    poster: item.poster_url || undefined,
  }));
}

export async function fetchAnimeList(limit = 30, page = 1): Promise<{ total: number; items: AdaptedAnimeCard[]; }> {
  const data = await apiFetch<RawAnimeListResponse>(`/anime/get-anime-list?page=${page}&limit=${limit}`);
  return {
    total: data.total_count,
    items: adaptAnimeList(data.anime_list || []),
  };
}
