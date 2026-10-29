"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "New order",
    href: "/dashboard/new",
    icon: (active) => (
      <svg
        className={`h-5 w-5 ${active ? "stroke-amber-600 dark:stroke-amber-400" : "stroke-gray-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={active ? 2.5 : 1.8}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: (active) => (
      <svg
        className={`h-5 w-5 ${active ? "stroke-amber-600 dark:stroke-amber-400" : "stroke-gray-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={active ? 2.5 : 1.8}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm0 5.25h.007v.008H3.75V12Zm0 5.25h.007v.008H3.75v-.008Z"
        />
      </svg>
    ),
  },
  {
    name: "Production",
    href: "/dashboard/production",
    icon: (active) => (
      <svg
        className={`h-5 w-5 ${active ? "stroke-amber-600 dark:stroke-amber-400" : "stroke-gray-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={active ? 2.5 : 1.8}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    name: "Menu",
    href: "/dashboard/menu",
    icon: (active) => (
      <svg
        className={`h-5 w-5 ${active ? "stroke-amber-600 dark:stroke-amber-400" : "stroke-gray-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={active ? 2.5 : 1.8}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
  {
    name: "Metrics",
    href: "/dashboard/metrics",
    icon: (active) => (
      <svg
        className={`h-5 w-5 ${active ? "stroke-amber-600 dark:stroke-amber-400" : "stroke-gray-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={active ? 2.5 : 1.8}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center border-t border-gray-200 bg-white/95 px-2 py-1 backdrop-blur dark:border-gray-800 dark:bg-neutral-950/95">
      <div className="flex w-full max-w-md items-center justify-around">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center py-1.5 text-[11px] font-medium transition-colors ${
                active
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              {item.icon(active)}
              <span className="mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

