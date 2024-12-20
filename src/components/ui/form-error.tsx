import { TriangleAlert } from 'lucide-react'

export default function FormError({ message }: { message?: string }) {
  if (!message) return null

  return (
    <div className="border-destructive text-destructive bg-destructive/20 flex h-12 items-center gap-2 rounded-lg border-2 px-4">
      <TriangleAlert size={20} />
      <p title={message} className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
        {message}
      </p>
    </div>
  )
}
