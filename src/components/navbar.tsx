import Link from 'next/link'
import { ButtonLink } from './ui/button'

export default function Navbar() {
  return (
    <header className="sticky top-0 h-14 w-full border-b px-5">
      <nav className="flex h-full items-center justify-between">
        <Link href="/">Craft & Quarters</Link>

        <ul>
          <li>
            <ButtonLink href="/login">Login</ButtonLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
