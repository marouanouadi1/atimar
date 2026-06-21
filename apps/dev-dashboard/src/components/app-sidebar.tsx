'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSyncExternalStore } from 'react'
import { Building2, ChevronRight, ConciergeBell, LogOut, Moon, Settings, Sun, Trophy, User, Volleyball, Zap } from 'lucide-react'
import { Collapsible } from 'radix-ui'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'

const NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    Icon: Zap,
    href: '/dashboard',
    sub: [] as { label: string; href: string }[],
  },
  {
    id: 'strutture',
    label: 'Strutture Sportive',
    Icon: Building2,
    href: '/dashboard/strutture',
    sub: [] as { label: string; href: string }[],
  },
  {
    id: 'campi',
    label: 'Campi Sportivi',
    Icon: Volleyball,
    href: '/dashboard/campi',
    sub: [] as { label: string; href: string }[],
  },
  {
    id: 'sport',
    label: 'Sport',
    Icon: Trophy,
    href: '/dashboard/sport',
    sub: [] as { label: string; href: string }[],
  },
  {
    id: 'servizi',
    label: 'Servizi',
    Icon: ConciergeBell,
    href: '/dashboard/servizi',
    sub: [] as { label: string; href: string }[],
  },
  {
    id: 'utenti',
    label: 'Utenti',
    Icon: User,
    href: '/dashboard/utenti',
    sub: [] as { label: string; href: string }[],
  },
]

function getThemeSnapshot() {
  return localStorage.getItem('theme') !== 'light'
}
function getServerSnapshot() {
  return true
}
function subscribeTheme(cb: () => void) {
  window.addEventListener('storage', cb)
  window.addEventListener('themechange', cb)
  return () => {
    window.removeEventListener('storage', cb)
    window.removeEventListener('themechange', cb)
  }
}

export function AppSidebar() {
  const pathname = usePathname()
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot)

  function toggleTheme() {
    const next = !isDark
    const value = next ? 'dark' : 'light'
    localStorage.setItem('theme', value)
    document.cookie = `theme=${value};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`
    document.documentElement.classList.toggle('dark', next)
    window.dispatchEvent(new Event('themechange'))
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Zap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Atimar</span>
                  <span className="truncate text-xs text-muted-foreground">Super Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigazione</SidebarGroupLabel>
          <SidebarMenu>
            {NAV.map(({ id, label, Icon, href, sub }) =>
              sub.length === 0 ? (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton asChild isActive={pathname === href} tooltip={label}>
                    <Link href={href}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                <Collapsible.Root
                  key={id}
                  asChild
                  defaultOpen={pathname.startsWith(href)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <Collapsible.Trigger asChild>
                      <SidebarMenuButton tooltip={label} isActive={pathname === href}>
                        <Icon />
                        <span>{label}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                      <SidebarMenuSub>
                        {sub.map((item) => (
                          <SidebarMenuSubItem key={item.href}>
                            <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                              <Link href={item.href}>{item.label}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </Collapsible.Content>
                  </SidebarMenuItem>
                </Collapsible.Root>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/dashboard/impostazioni')}
              tooltip="Impostazioni"
            >
              <Link href="/dashboard/impostazioni">
                <Settings />
                <span>Impostazioni</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip={isDark ? 'Tema chiaro' : 'Tema scuro'}
            >
              {isDark ? <Sun /> : <Moon />}
              <span>{isDark ? 'Tema chiaro' : 'Tema scuro'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
