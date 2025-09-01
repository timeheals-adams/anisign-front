"use client";
import React from 'react';

interface AnimeListErrorProps {
  message: string;
  onRetry: () => void;
}

// Error block styled according to existing design tokens (muted, destructive accents)
export function AnimeListError({ message, onRetry }: AnimeListErrorProps) {
  return (
    <div className="w-full max-w-[1296px] min-h-[116px] px-[31px] py-[30px] bg-[#c8c7ca] rounded-[14px] flex flex-col sm:flex-row justify-between gap-6 sm:gap-10 items-start sm:items-center">
      <div className="w-full sm:max-w-[420px] flex flex-col gap-3">
        <div className="text-[#060606] text-base font-semibold font-[var(--font-montserrat)]">Не удалось загрузить аниме</div>
        <div className="text-[#060606] text-sm font-medium opacity-70 font-[var(--font-montserrat)]">
          {message || 'Аниме застряло в портале. Перезагрузка может помочь.'}
        </div>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="h-[50px] px-5 py-3.5 bg-[#060606] rounded-xl flex items-center justify-center text-[#c8c7ca] text-sm font-semibold font-[var(--font-montserrat)] leading-tight hover:brightness-110 active:brightness-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
      >
        Повторить
      </button>
    </div>
  );
}
