import React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';

// Информационная полоска о бета-версии + кнопка репорта.
// RSC: статический контент, без интерактива. Позже можно заменить на клиентский баннер с dismiss.
export function ReportBar() {
  return (
    <div className="bg-[rgba(200,199,202,0.02)]">
      <div className="flex justify-center">
        <div className="w-full max-w-[1650px] flex items-center justify-between py-[15px] px-5 gap-4">
          <p className="text-[#a7a7a7] text-sm font-medium font-[Montserrat] leading-tight">
            Сайт находиться в бета версии, если вам удалось найти баг обратитесь в поддержку
          </p>
          <Link
            href="/report"
            className={cn(
              'rounded-[7px] bg-[rgba(200,199,202,0.05)] px-4 py-2 text-sm font-medium font-[Montserrat] text-[#cdcdcd] backdrop-blur-sm',
              'hover:bg-white/10 transition-colors'
            )}
          >
            Репорт
          </Link>
        </div>
      </div>
    </div>
  );
}
