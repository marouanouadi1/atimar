'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export type Step = {
  title: string
  description?: string
  content: React.ReactNode
}

type Props = {
  trigger: React.ReactNode
  steps: Step[]
  onComplete: () => void | Promise<void>
  onClose?: () => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function MultiStepDialog({
  trigger,
  steps,
  onComplete,
  onClose,
  isSubmitting = false,
  submitLabel = 'Conferma',
}: Props) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  const isFirst = current === 0
  const isLast = current === steps.length - 1
  const step = steps[current]

  function handleOpen(value: boolean) {
    setOpen(value)
    if (!value) {
      setCurrent(0)
      onClose?.()
    }
  }

  async function handleNext() {
    if (isLast) {
      await onComplete()
      setOpen(false)
      setCurrent(0)
    } else {
      setCurrent((c) => c + 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{step.title}</DialogTitle>
          {step.description && (
            <p className="text-sm text-muted-foreground">{step.description}</p>
          )}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1">
              <StepIndicator total={steps.length} current={current} />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {current + 1} / {steps.length}
            </span>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 py-2">{step.content}</div>

        <div className="flex justify-between pt-2 border-t">
          <Button
            variant="ghost"
            onClick={() => setCurrent((c) => c - 1)}
            disabled={isFirst}
          >
            Indietro
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting}>
            {isLast ? (isSubmitting ? 'Salvataggio...' : submitLabel) : 'Avanti'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StepIndicator({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 pt-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i <= current ? 'bg-primary' : 'bg-muted'
          }`}
        />
      ))}
    </div>
  )
}
