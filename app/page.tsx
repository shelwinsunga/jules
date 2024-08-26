'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b">
        <Link className="text-lg font-bold" href="#">
          ACME
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link className="text-sm hover:text-gray-600 transition-colors" href="#">
            Product
          </Link>
          <Link className="text-sm hover:text-gray-600 transition-colors" href="#">
            Features
          </Link>
          <Link className="text-sm hover:text-gray-600 transition-colors" href="#">
            Contact
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
        <nav className="flex flex-col items-center gap-4 p-4 md:hidden border-b">
          <Link className="text-sm hover:text-gray-600 transition-colors" href="#">
            Product
          </Link>
          <Link className="text-sm hover:text-gray-600 transition-colors" href="#">
            Features
          </Link>
          <Link className="text-sm hover:text-gray-600 transition-colors" href="#">
            Contact
          </Link>
        </nav>
      )}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6">
          <div className="container mx-auto flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 animate-fade-in">
              Simplify Your Workflow
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl mb-8 animate-fade-in animation-delay-200">
              Streamline your tasks, boost productivity, and achieve more with our intuitive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-300">
              <Button asChild>
                <Link href="/projects">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 w-full px-4 md:px-6 border-t">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-xs text-gray-500">© 2024 ACME Inc. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link className="text-xs text-gray-500 hover:text-gray-600 transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-xs text-gray-500 hover:text-gray-600 transition-colors" href="#">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}