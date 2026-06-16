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
  { id: 1, nome: 'Campo A', struttura: 'Centro Sportivo Olimpia', sport: 'Calcio', stato: 'Attivo' },
  { id: 2, nome: 'Campo B', struttura: 'Polisportiva Azzurra', sport: 'Tennis', stato: 'Attivo' },
  { id: 3, nome: 'Campo C', struttura: 'Stadium Nord', sport: 'Basket', stato: 'Inattivo' },
]

export default function CampiPage() {
  return (
    <>
      <Topbar
        title="Campi Sportivi"
        action={<Button size="sm">+ Aggiungi</Button>}
      />
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Struttura</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="w-[80px]">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell>{c.struttura}</TableCell>
                <TableCell>{c.sport}</TableCell>
                <TableCell>
                  <Badge variant={c.stato === 'Attivo' ? 'default' : 'secondary'}>
                    {c.stato}
                  </Badge>
                </TableCell>
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
