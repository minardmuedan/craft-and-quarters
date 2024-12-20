import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Craft & Quarters',
  description: 'A full-stack ecommerce website, made by Minard Parilla',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navbar />

        <Toaster position="top-right" theme="light" richColors />

        <main>{children}</main>
      </body>
    </html>
  )
}
