import { IconSidebar } from '@/components/sidebar/icon-sidebar'
import { SubSidebar } from '@/components/sidebar/sub-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <IconSidebar />
      <SubSidebar />
      <main className="flex flex-1 flex-col overflow-auto">{children}</main>
    </div>
  )
}
