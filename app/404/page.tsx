import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            404
          </span>
        </h1>
        <p className="text-2xl font-medium mb-6 text-muted-foreground">
          Whoops! Page not found
        </p>
        <div className="max-w-md text-center mb-8">
          <p className="text-muted-foreground">
            Looks like you've stumbled into the void. Don't panic! Even the best of us get lost in cyberspace sometimes.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          Beam Me Home, Scotty!
        </Link>
      </div>
    </div>
  )
}