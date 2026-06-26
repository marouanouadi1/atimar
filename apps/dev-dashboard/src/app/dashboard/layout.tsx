export const dynamic = 'force-dynamic'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/app-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden">{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
