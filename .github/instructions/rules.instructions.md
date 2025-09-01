# Anisign Front – Internal Instructions (v0.1)

Документ: внутренние правила и архитектурные договорённости для фронтенда (Next.js + FastAPI backend).

Обновлять при изменениях архитектуры. Коротко, конкретно, без воды.

---

## 1. Цели
1. Быстрый TTFB и SEO для публичного каталога аниме.
2. Минимум лишнего JS на клиенте (используем RSC по умолчанию).
3. Предсказуемые данные: TanStack Query для серверного состояния, Zustand только для локального UI/auth.
4. Безопасная аутентификация: access токен в памяти, refresh в HttpOnly cookie.
5. Оптимистичные интерактивные сценарии (комменты, лайки, списки, прогресс эпизодов).
6. Лёгкое масштабирование (кеширование, инвалидация через revalidateTag, типы из OpenAPI).

## 2. Стек (минимум на MVP)
| Категория | Выбор |
|-----------|-------|
| Framework | Next.js 15 (App Router, RSC) |
| Язык | TypeScript (strict) |
| Server state | @tanstack/react-query |
| Local state | Zustand (auth/ui) |
| Формы | React Hook Form + Zod |
| Валидация env | Zod (env.ts) |
| UI | Tailwind CSS + (в перспективе) shadcn/ui/Radix |
| Иконки | (позже) lucide-react |
| HTTP | custom fetch wrapper (apiClient) |
| OpenAPI типы | openapi-typescript (dev script) |
| Realtime | WebSocket (native) + небольшой хук |
| Тесты | (позже) Vitest + RTL + Playwright |
| Линт/формат | Biome (уже есть) |
| Observability | (позже) Sentry |

Расширения (позже): TanStack Table, react-virtual, msw, bundle analyzer.

## 3. Структура папок (планируемая)
```
src/
  app/
    api/auth/refresh/route.ts      # proxy refresh
    auth/login/page.tsx            # client
    anime/page.tsx                 # server (каталог)
    anime/[id]/page.tsx            # server (деталь)
    profile/[username]/page.tsx    # server (публично)
    friends/page.tsx               # server + client widgets
    layout.tsx
  components/
    server/                        # RSC компоненты (без 'use client')
    client/                        # интерактивные компоненты
  features/
    anime/
    comments/
    auth/
    friends/
    lists/
    viewHistory/
  lib/
    apiClient.ts
    queryClient.ts
    websocket.ts
    env.ts
    openapi/                       # schema.d.ts (генерация)
  stores/
    authStore.ts
  hooks/
    useCurrentUser.ts
    useWebSocket.ts
  tests/
```

## 4. Server vs Client критерии
| Вопрос | Ответ |
|--------|-------|
| Нужен SEO / кеш? | Server |
| Только чтение публичных данных? | Server |
| Нужен токен (доступ в памяти)? | Client |
| useEffect / событие / форма? | Client |
| WebSocket / realtime? | Client |
| Гибрид (деталь + персонализация)? | Server shell + client widgets |

Анти‑паттерн: помечать целые страницы 'use client' без необходимости.

## 5. Auth поток
1. Login (POST /auth/token) → access (setAccessToken), refresh cookie ставит backend.
2. Все запросы через apiClient c Authorization: Bearer <access> (если есть).
3. При 401 один автоматический refresh через `/api/auth/refresh` (route handler проксирует GET /auth/refresh-token) → повтор.
4. Logout: POST /auth/logout → очистить accessToken + invalidateQueries.
5. Access **не** в localStorage. Память модуля или Zustand store.

## 6. apiClient (принципы)
* Единая функция `apiFetch<T>(path, options)`.
* Добавляет Authorization если токен есть.
* 401 → refresh (один раз) → повтор → иначе throw.
* Возвращает JSON, ошибки преобразует в `ApiError` (message, status, payload?).
* credentials: 'include' (нужны cookie refresh).

## 7. TanStack Query соглашения
Key Patterns:
* Сущности: ['anime','detail', id]
* Списки: ['anime','list', params]
* Пользователь: ['user','me']
* Комментарии: ['comments', animeId]
* Друзья: ['friends', 'list']
* Списки сохранений: ['saveLists', userId]
* Прогресс: ['progress', animeId, userId]

StaleTime:
* Публичные справочники: 5 мин
* Пользовательские: 0–30 сек (по умолчанию)

Optimistic mutate pattern:
1. cancelQueries
2. snapshot prev
3. setQueryData (draft optimistic)
4. onError rollback
5. onSettled invalidate

## 8. Мутации (карта)
| Домен | Эндпоинты | Тип паттерна |
|-------|-----------|--------------|
| Комментарии | create / update / delete / like / dislike | optimistic (лист + счётчики) |
| Прогресс эпизода | update-current-episode | throttle + optimistic местная позиция |
| Сохранённые списки | create / put / delete-anime-id | optimistic + invalidate список по имени |
| Друзья | invite / accept / delete | optimistic (статусы заявок) + ws events |
| ViewHistory | add | буфер (batch) / debounce |

## 9. Realtime
* WebSocket URL: `${NEXT_PUBLIC_WS_URL}` (переменная env).
* Хук `useWebSocket(url, { onMessage })` – авто-reconnect (экспоненциальный backoff до 30s).
* Сообщения → диспетч событие → локальный обработчик (update store / invalidateQueries).

## 10. OpenAPI типы
Скрипт (добавить позже в package.json):
`"generate:api": "openapi-typescript %OPENAPI_URL% -o src/lib/openapi/schema.d.ts"`

Процесс:
1. Указать OPENAPI_URL в .env.local
2. Запустить скрипт перед билдом (или prebuild hook)
3. Импорт типов: `import type { paths } from '@/lib/openapi/schema';`
4. Тип ответа: `type GetAnime = paths['/anime/id/{anime_id}']['get']['responses']['200']['content']['application/json'];`

## 11. Формы / валидация
* Zod схемы в `features/<module>/schema.ts`.
* RHF + zodResolver.
* Ошибки API мапим в setError(field, { message }).
* File upload (аватар/баннер): получить signed URL (если добавим) → PUT файл → POST метаданные.

## 12. Кеширование (Next fetch)
* Публичные GET: `fetch(url, { next: { revalidate: 300, tags: ['anime-list'] } })`
* Инвалидация после админ/cron: route handler → `revalidateTag('anime-list')`.
* Персональные запросы: `cache: 'no-store'` или полностью через клиентский fetch.

## 13. Env типизация
`env.ts` экспортирует объект после проверки Zod. Пример:
```ts
import { z } from 'zod';
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_WS_URL: z.string().url().optional(),
});
export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
});
```

## 14. Кодстайл
* Biome: формат + линт (`pnpm lint`, `pnpm format`).
* Именование: компоненты PascalCase, хуки useXxx, сторы camelCase + Store.
* Без default экспорта для хуков и стора (кроме страниц). Страницы (page.tsx) – default required.

## 15. Тестирование (этап 2)
| Тип | Инструменты | Цели |
|-----|-------------|------|
| Unit | Vitest | apiClient, утилиты |
| Component | React Testing Library | формы, optimistic UI |
| E2E | Playwright | auth flow, каталог, комменты |
| Mock API | MSW | изоляция от backend |

CI (позже): GitHub Actions (install → generate:api → lint → test → build).

## 16. Производительность
* Меньше 'use client'.
* Dynamic import для heavy (видео-плеер) → `ssr: false`.
* react-virtual при >100 элементов списка.
* Стабильные keys для списков.
* Изображения через `next/image` (при добавлении). 

## 17. Безопасность
* Не хранить access в storage.
* GET не использовать для мутаций (постепенно исправлять на backend: update-status → PUT/PATCH).
* Ограничить размер upload перед отправкой.
* Проверять MIME на клиенте.

## 18. Roadmap (MVP → Iterations)
MVP Sprint 1:
1. env.ts + apiClient.ts + authStore.ts
2. route `/api/auth/refresh` (proxy)
3. Страница каталога (SSR) + базовый список
4. Деталь аниме (SSR) + заглушка комментов

Sprint 2:
5. TanStack Query провайдер + комменты CRUD (optimistic like)
6. Прогресс эпизода (update-current-episode) + throttle
7. Сохранённые списки (create + add + remove)

Sprint 3:
8. WebSocket (друзья / новые комменты уведомления)
9. Друзья (invite / accept / list)
10. ViewHistory debounce

Sprint 4:
11. Генерация OpenAPI типов + refactor типов
12. Тестовый контур (Vitest + RTL + Playwright smoke)
13. Sentry интеграция

## 19. Definition of Done (фича)
1. Типы есть, нет any утечек наружу.
2. Запросы через apiClient, есть обработка ошибок.
3. Есть optimistic UI (если применимо) + rollback.
4. Query keys документированы.
5. Нет лишних 'use client'.
6. Линт и формат без ошибок.
7. (Позже) Тесты зелёные.

## 20. Быстрый старт разработчика
1. Скопировать `.env.local.example` → `.env.local` (создать пример позже).
2. `pnpm install`
3. `pnpm dev`
4. Добавить API URL в env.
5. Создать ветку feature/... и работать по Roadmap.

---
Четкость > полнота. Обновляй файл при изменении процессов.
