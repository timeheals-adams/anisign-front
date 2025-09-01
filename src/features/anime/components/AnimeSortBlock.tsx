import React from 'react';

// Pure server component: exact markup & classes per provided design snippet.
export function AnimeSortBlock() {
  return (
    <div data-state="open" className="bg-[rgba(255,255,255,0.02)] border border-white/5 p-5 rounded-[14px] mb-3 group" style={{ opacity: 1, transform: 'none' }}>
      <div className="flex items-center justify-between gap-2" style={{ opacity: 1 }}>
        <div className="flex items-center gap-2 cursor-pointer flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-4 h-4 text-white/60"><path d="m6 9 6 6 6-6"></path></svg>
          <div className="flex items-center">
            <h3 className="text-[14px] font-medium text-white/80">Сортировка по</h3>
            <div className="ml-2 w-2 h-2 rounded-full bg-[#50e3c2]"></div>
          </div>
        </div>
        <button className="inline-flex gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary/60 hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 h-8 w-8" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="size-4 group-data-[state=closed]:hidden"><path fill="currentColor" d="m12 10.8l-3.9 3.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"></path></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="size-4 group-data-[state=open]:hidden"><path fill="currentColor" d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275t.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062"></path></svg>
        </button>
      </div>
      <div className="overflow-hidden" style={{ height: 'auto', opacity: 1, marginTop: 16 }}>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 h-[35px] flex items-center gap-[10px] rounded-full text-[13px] font-medium transition-all duration-300 bg-[#C8C7CA] text-[#060606]" type="button">
            <div className="flex items-center">Рейтингу<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 w-3 h-3"><path d="m18 15-6-6-6 6"></path></svg></div>
          </button>
          <button className="px-4 h-[35px] flex items-center gap-[10px] rounded-full text-[13px] font-medium transition-all duration-300 bg-white/5 text-white/60 hover:bg-white/10" type="button">
            <div className="flex items-center">Дате выхода</div>
          </button>
          <button className="px-4 h-[35px] flex items-center gap-[10px] rounded-full text-[13px] font-medium transition-all duration-300 bg-white/5 text-white/60 hover:bg-white/10" type="button">
            <div className="flex items-center">Названию</div>
          </button>
        </div>
      </div>
    </div>
  );
}
