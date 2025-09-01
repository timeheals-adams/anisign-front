import React from 'react';

export function AnimeFiltersBar() {
  return (
    <div className="flex flex-wrap justify-between gap-3">
        <div className='flex gap-3'>
            <button className="inline-flex items-center gap-2 rounded-full bg-zinc-800/20 px-4 py-1.5 outline outline-1 -outline-offset-1 outline-[#19191a] text-xs font-medium text-neutral-50 font-[Montserrat] leading-none hover:bg-zinc-800/30 transition">
                Недавно оконченные
                <span className="opacity-30" aria-hidden>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 1.8a6.6 6.6 0 1 1 0 13.2 6.6 6.6 0 0 1 0-13.2Z" fill="#FAFAFA" fillOpacity="0.3" />
                </svg>
                </span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-zinc-800/20 px-4 py-1.5 outline outline-1 -outline-offset-1 outline-[#19191a] text-xs font-medium text-neutral-50 font-[Montserrat] leading-none hover:bg-zinc-800/30 transition">
                Рейтинговые онгоинги
                <span className="opacity-30" aria-hidden>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 1.8a6.6 6.6 0 1 1 0 13.2 6.6 6.6 0 0 1 0-13.2Z" fill="#FAFAFA" fillOpacity="0.3" />
                </svg>
                </span>
            </button>
        </div>
      <button className="inline-flex items-center gap-2 rounded-[10px] bg-zinc-800/20 px-4 py-2 outline outline-1 -outline-offset-1 outline-[#19191a] text-sm font-medium text-neutral-50 font-[Montserrat] leading-tight hover:bg-zinc-800/30 transition">
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90" aria-hidden>
          <path d="M2.3 4.46h11.9M4.93 8.43h6.62M6.92 12.4h2.64" stroke="#FAFAFA" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Пресеты
      </button>
    </div>
  );
}
