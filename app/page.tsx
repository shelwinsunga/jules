import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import AuthButtons from '@/components/projects/auth-buttons';
import Spline from '@splinetool/react-spline/next';
import GridTexture from '@/components/page-utils/grid-texture';
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Star } from 'lucide-react';
import { Github } from 'lucide-react';

export default async function Home() {
  const stars = await getGitHubStars();

  return (
    <div className="flex flex-col min-h-screen text-foreground relative">
      <GridTexture />
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-border">
        <Link className="text-lg font-bold" href="#">
          Jules
        </Link>
        <nav className="flex items-center gap-4">
          <AuthButtons />
        </nav>
      </header>
      <main className="flex-1 relative">
        <section className="w-full py-8 px-4 md:px-6 relative z-10">
          <div className="container mx-auto flex flex-col items-center text-center">
            <div className="mb-6">
              <RainbowButton>
                <Link href="https://github.com/shelwinsunga/jules" target="_blank" className="flex items-center">
                  <Github className="h-4 w-4 fill-current" />
                  <span className="ml-2">Star on GitHub</span>
                  <div className="flex items-center">
                    <Star className="ml-2 h-4 w-4 fill-current" />
                    <span className="ml-2">{stars}</span>
                  </div>
                </Link>
              </RainbowButton>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 animate-fade-in">
              AI-Powered LaTeX Editing
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl mb-8 animate-fade-in animation-delay-200">
              Jules is inspired by Cursor and Overleaf. This is a proof of concept.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-300">
              <Button asChild>
                <Link href="/login">
                  Try Jules Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <div className="absolute inset-x-0 bottom-0 w-full h-[90%]">
          <Spline
            scene="https://prod.spline.design/gQanJmdg7BDjlCcX/scene.splinecode" 
            className="w-full h-full object-cover"
          />
        </div>
      </main>
    </div>
  )
}

async function getGitHubStars() {
  const response = await fetch('https://api.github.com/repos/shelwinsunga/jules', {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.stargazers_count;
} 