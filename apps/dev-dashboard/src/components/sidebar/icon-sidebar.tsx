'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Zap,
  Building2,
  Volleyball,
  User,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { NAV_MAIN } from '@/lib/nav'

const ICON_MAP = {
  Zap,
  Building2,
  Volleyball,
  User,
  Settings,
} as const

type IconName = keyof typeof ICON_MAP

function SidebarLink({
  href,
  icon,
  label,
  isActive,
}: {
  href: string
  icon: IconName
  label: string
  isActive: boolean
}) {
  const Icon = ICON_MAP[icon]
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-md transition-colors',
            isActive
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

export function IconSidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <nav className="flex w-[52px] flex-shrink-0 flex-col items-center gap-1 border-r border-border bg-sidebar py-3">
        <div className="flex flex-1 flex-col items-center gap-1">
          {NAV_MAIN.map((section) => (
            <SidebarLink
              key={section.id}
              href={section.href}
              icon={section.icon as IconName}
              label={section.label}
              isActive={isActive(section.href)}
            />
          ))}
        </div>
        <SidebarLink
          href="/dashboard/impostazioni"
          icon="Settings"
          label="Impostazioni"
          isActive={pathname.startsWith('/dashboard/impostazioni')}
        />
      </nav>
    </TooltipProvider>
  )
}
