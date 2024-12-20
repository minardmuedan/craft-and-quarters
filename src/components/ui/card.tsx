import * as React from 'react'

import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('bg-card text-card-foreground w-full rounded-lg border shadow-sm sm:max-w-md', className)}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { title: string; description: string }
>(({ title, description, className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
    <p className="text-2xl font-semibold leading-none tracking-tight">{title}</p>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
))
CardHeader.displayName = 'CardHeader'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardContent }
