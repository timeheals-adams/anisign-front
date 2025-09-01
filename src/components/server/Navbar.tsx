import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/cn';

// Стилизация по предоставленному макету (Montserrat / цвета / отступы), но без фиксированной ширины страницы.
// Внешняя обёртка тянется на 100%, контент ограничен max-w-[1650px].
export function Navbar() {
  return (
    <header className="border-b border-white/5 bg-[#060606]">
      <div className="flex justify-center">
        <div className="w-full container px-5 py-[26px] flex justify-between items-center">
          {/* Левая часть */}
          <div className="flex items-center gap-[25px]">
            <div className="flex items-center gap-[15px] select-none">
              <Link href="/" aria-label="Anisign home" className="flex items-center gap-[15px]">
                <span className="inline-flex h-11 w-11 items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Anisign"
                    width={44}
                    height={44}
                    priority
                    className="h-11 w-11 rounded-full object-cover"
                  />
                </span>
                <span className="text-white text-base font-semibold leading-tight tracking-tight font-[Montserrat]">Anisign</span>
              </Link>
            </div>
            {/* Вертикальный разделитель */}
            <div className="hidden md:block h-5 w-px bg-white/5" />
            {/* Навигация */}
            <nav className="hidden md:flex items-center gap-5">
              <Link href="/anime" className={navItemClass}>Список аниме</Link>
              <Link href="/characters" className={navItemClass}>Персонажи</Link>
              <Link href="/news" className={navItemClass}>Новости</Link>
            </nav>
          </div>

          {/* Правая часть */}
          <div className="flex items-center gap-5">
            {/* Поиск (пока статический) */}
            <form className="hidden lg:flex h-[50px] w-[285px] items-center rounded-xl outline outline-1 -outline-offset-1 outline-[#d9d9d9]/5 px-[17px] py-[15px]" role="search" aria-label="Поиск">
              <div className="flex items-center gap-2 w-full">
                <span className="text-[#C8C7CA]" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                    <circle cx="7.333" cy="7.333" r="5.333" />
                    <path d="M11 11.306L14.333 14.639" />
                  </svg>
                </span>
                {/* Инпут можно подключить позже (клиентский компонент). Пока span чтобы не тянуть 'use client'. */}
                <span className="text-[#c8c7ca] text-sm font-medium font-[Montserrat] leading-tight select-none">Поиск...</span>
              </div>
            </form>
            <div className="flex items-center gap-[15px]">
              <div className="hidden md:block h-5 w-px bg-white/5" />
              <Link href="/login" className={cn(btnBase, 'bg-transparent text-[#c8c7ca]')}>Войти</Link>
              <Link
                href="/register"
                className={cn(btnBase, 'h-[50px] bg-[#c8c7ca] text-[#060606]')}
              >
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const navItemClass = cn(
  'text-[#aeaeae] text-sm font-medium font-[Montserrat] leading-tight hover:text-white transition-colors'
);

const btnBase = cn(
  'px-5 py-3.5 rounded-xl flex items-center justify-center gap-2.5 overflow-hidden text-sm font-semibold font-[Montserrat] leading-tight transition-colors'
);
