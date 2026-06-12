'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NAV_MAIN } from '@/lib/nav'
import { Separator } from '@/components/ui/separator'

export function SubSidebar() {
  const pathname = usePathname()

  const activeSection = NAV_MAIN.find((s) => {
    if (s.href === '/dashboard') return false
    return pathname.startsWith(s.href)
  })

  if (!activeSection || activeSection.sub.length === 0) {
    return null
  }

  return (
    <aside className="w-[180px] flex-shrink-0 border-r border-border bg-sidebar">
      <div className="px-3 py-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {activeSection.label}
        </p>
        <Separator className="mb-3" />
        <nav className="flex flex-col gap-0.5">
          {activeSection.sub.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-2 py-1.5 text-sm transition-colors',
                pathname === item.href
                  ? 'border-l-2 border-primary pl-[6px] bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
