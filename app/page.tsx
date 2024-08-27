'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b border-border">
        <Link className="text-lg font-bold" href="#">
          AnyTeX
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link className="text-sm hover:text-muted-foreground transition-colors" href="#">
            Features
          </Link>
          <Link className="text-sm hover:text-muted-foreground transition-colors" href="#">
            Pricing
          </Link>
          <Link className="text-sm hover:text-muted-foreground transition-colors" href="#">
            Documentation
          </Link>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </header>
      {isMenuOpen && (
        <nav className="flex flex-col items-center gap-4 p-4 md:hidden border-b border-border">
          <Link className="text-sm hover:text-muted-foreground transition-colors" href="#">
            Features
          </Link>
          <Link className="text-sm hover:text-muted-foreground transition-colors" href="#">
            Pricing
          </Link>
          <Link className="text-sm hover:text-muted-foreground transition-colors" href="#">
            Documentation
          </Link>
        </nav>
      )}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6">
          <div className="container mx-auto flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 animate-fade-in">
              AI-Powered LaTeX Editing
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl mb-8 animate-fade-in animation-delay-200">
              Elevate your LaTeX game with AnyTeX. AI-powered tools for faster, smarter academic and professional writing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-300">
              <Button asChild>
                <Link href="/projects">
                  Try AnyTeX Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 w-full px-4 md:px-6 border-t border-border">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-xs text-muted-foreground">© 2024 AnyTeX. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}