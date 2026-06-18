"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useActiveBatch } from "@/hooks/useActiveBatch";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isActivePath } from "./nav-items";

export function Header() {
  const pathname = usePathname();
  const activeBatch = useActiveBatch();
  return (
    <header className="sticky top-0 z-30 border-b bg-card text-card-foreground">
      <div className="flex h-14 items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-baseline gap-2">
          <span className="font-mono text-xs text-muted-foreground">MAGNA</span>
          <span className="text-sm font-bold tracking-tight">Üretim Takip</span>
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = isActivePath(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {activeBatch.data ? (
            <span className="hidden items-center gap-1.5 md:flex">
              <span className="text-xs text-muted-foreground">Aktif:</span>
              <Badge tone="success" className="max-w-[180px] truncate">
                {activeBatch.data.filename}
              </Badge>
            </span>
          ) : null}
          <span className="hidden text-xs text-muted-foreground sm:inline">env:</span>
          <Badge tone="outline">development</Badge>
        </div>
      </div>
    </header>
  );
}
