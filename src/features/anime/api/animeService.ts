import { apiFetch } from '@/lib/apiClient';
import type { paths } from '@/lib/openapi/schema';

// Derive raw response type from OpenAPI (still 'unknown' content, so we'll assert shape)
type GetAnimeListOperation = paths['/anime/get-anime-list']['get'];
type GetAnimeListResponse = GetAnimeListOperation['responses']['200']['content']['application/json'];

// Runtime narrowing helper (defensive) – we trust backend but keep a guard.
function isRecord(v: unknown): v is Record<string, unknown> { return typeof v === 'object' && v !== null; }
function isArray(v: unknown): v is unknown[] { return Array.isArray(v); }

export interface AdaptedAnimeCard {
  id: string; // use anime_id
  title: string;
  year?: number;
  kind?: string;
  score?: number;
  poster?: string;
}

// Generic loose record without using 'any'.
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface RawAnimeItemUnsafe { [k: string]: unknown }

function extractYear(item: RawAnimeItemUnsafe): number | undefined {
  const candidate = (item as Record<string, unknown>).aired_on ?? (item as Record<string, unknown>).released_on;
  if (typeof candidate !== 'string' || candidate.length < 4) return undefined;
  const d = new Date(candidate);
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

export function adaptAnimeList(raw: RawAnimeItemUnsafe[]): AdaptedAnimeCard[] {
  return raw.map(item => {
    const animeId = typeof item.anime_id === 'string' ? item.anime_id : (typeof item.id === 'string' ? item.id : '');
    return {
      id: animeId,
      title: (item.russian && typeof item.russian === 'string') ? item.russian : (typeof item.english === 'string' ? item.english : 'Без названия'),
      year: extractYear(item),
      kind: normalizeKind(typeof item.kind === 'string' ? item.kind : undefined),
      score: typeof item.score === 'number' ? Number(item.score.toFixed(2)) : undefined,
      poster: typeof item.poster_url === 'string' ? item.poster_url : undefined,
    };
  }).filter(i => i.id);
}

export async function fetchAnimeList(limit = 30, page = 1): Promise<{ total: number; items: AdaptedAnimeCard[]; }> {
  const data = await apiFetch<GetAnimeListResponse>(`/anime/get-anime-list?page=${page}&limit=${limit}`);
  if (!isRecord(data)) return { total: 0, items: [] };
  const total = typeof data.total_count === 'number' ? data.total_count : 0;
  // Access unknown field safely
  const possibleList = (data as Record<string, unknown>)['anime_list'];
  const listRaw: RawAnimeItemUnsafe[] = isArray(possibleList)
    ? (possibleList as unknown[]).filter(isRecord) as RawAnimeItemUnsafe[]
    : [];
  return { total, items: adaptAnimeList(listRaw) };
}
