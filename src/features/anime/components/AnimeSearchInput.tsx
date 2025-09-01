import React from 'react';

export function AnimeSearchInput() {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Введи название аниме.."
        className="h-12 w-full rounded-[10px] bg-zinc-800/20 px-4 text-sm font-normal text-[#c8c7ca] font-[Montserrat] outline outline-1 -outline-offset-1 outline-[#19191a] placeholder:text-[#c8c7ca]/60 focus:bg-zinc-800/30 focus:ring-0"
        name="q"
        autoComplete="off"
      />
    </div>
  );
}
