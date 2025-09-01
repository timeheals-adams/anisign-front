import React from 'react';

export function AnimeSortPanel() {
  return (
    <aside className="w-72 rounded-[14px] border border-white/5 p-5 font-[Montserrat]">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <span className="text-sm font-medium text-white/80 leading-[21px]">Сортировка по</span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M8 7.2 5.4 9.8a.66.66 0 0 1-.934-.934L7.533 5.8c.134-.133.29-.2.467-.2.178 0 .333.067.467.2l3.067 3.067a.66.66 0 1 1-.934.934L8 7.2Z" fill="#FAFAFA" />
          </svg>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {['Рейтингу', 'Дате выхода', 'Названию'].map(item => (
          <button
            key={item}
            className="rounded-full bg-white/5 px-4 py-1.5 text-[13px] font-medium leading-tight text-white/60 hover:bg-white/10 transition"
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </aside>
  );
}
