import { Topbar } from '@/components/topbar'
import { Card, CardContent } from '@/components/ui/card'

export default function ImpostazioniPage() {
  return (
    <>
      <Topbar title="Impostazioni" />
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="max-w-sm text-center">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Sezione in costruzione</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
