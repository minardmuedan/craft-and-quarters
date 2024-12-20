import { cn } from '@/lib/utils'
import { Loader2, LucideProps } from 'lucide-react'

export default function LoaderIcon({ className, ...props }: LucideProps) {
  return <Loader2 className={cn('size-4 shrink-0 animate-spin', className)} {...props} />
}
