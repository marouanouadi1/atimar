import { Topbar } from '@/components/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Volleyball, User } from 'lucide-react'
import { supabase } from '@atimar/api'
import Link from 'next/link'

export default async function DashboardPage() {
  const [
    { count: strutture },
    { count: campi },
    { count: utenti },
  ] = await Promise.all([
    supabase.from('Strutture').select('*', { count: 'exact', head: true }),
    supabase.from('Campi').select('*', { count: 'exact', head: true }),
    supabase.from('Profili').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Strutture', value: strutture, Icon: Building2, iconColor: 'bg-blue-700', cardColor: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white', href: '/dashboard/strutture' },
    { label: 'Campi', value: campi, Icon: Volleyball, iconColor: 'bg-emerald-700', cardColor: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white', href: '/dashboard/campi' },
    { label: 'Utenti', value: utenti, Icon: User, iconColor: 'bg-violet-700', cardColor: 'bg-gradient-to-br from-violet-400 to-violet-600 text-white', href: '/dashboard/utenti' },
  ]

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, Icon, iconColor, cardColor, href }) => (
            <Link key={label} href={href}>
              <Card className={`overflow-hidden hover:opacity-90 transition-opacity cursor-pointer border-0 ${cardColor}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <div className={`${iconColor} rounded-md p-1.5 text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{value ?? '—'}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
