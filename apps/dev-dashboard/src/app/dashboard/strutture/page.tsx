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
  { id: 1, nome: 'Centro Sportivo Olimpia', citta: 'Milano', stato: 'Attivo' },
  { id: 2, nome: 'Polisportiva Azzurra', citta: 'Roma', stato: 'Attivo' },
  { id: 3, nome: 'Stadium Nord', citta: 'Torino', stato: 'Inattivo' },
]

export default function StrutturePage() {
  return (
    <>
      <Topbar
        title="Strutture Sportive"
        action={<Button size="sm">+ Aggiungi</Button>}
      />
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Città</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="w-[80px]">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.nome}</TableCell>
                <TableCell>{s.citta}</TableCell>
                <TableCell>
                  <Badge variant={s.stato === 'Attivo' ? 'default' : 'secondary'}>
                    {s.stato}
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
