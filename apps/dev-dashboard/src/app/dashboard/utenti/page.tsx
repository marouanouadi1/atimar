import { Topbar } from '@/components/topbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const MOCK = [
  { id: 1, email: 'admin@atimar.com', ruolo: 'Superadmin', creato: '2025-01-10' },
  { id: 2, email: 'dev@atimar.com', ruolo: 'Developer', creato: '2025-03-22' },
  { id: 3, email: 'test@atimar.com', ruolo: 'Viewer', creato: '2026-01-05' },
]

export default function UtentiPage() {
  return (
    <>
      <Topbar
        title="Utenti"
        action={<Button size="sm">+ Aggiungi</Button>}
      />
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Ruolo</TableHead>
              <TableHead>Creato il</TableHead>
              <TableHead className="w-[80px]">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{u.ruolo}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.creato}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Modifica
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
