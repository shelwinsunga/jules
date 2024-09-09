'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import Image from 'next/image'

export default function ImageViewer({ src, alt }: { src: string, alt: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
    useEffect(() => {
      if (src) {
        const img = new window.Image()
        img.onload = () => {
          setDimensions({ width: img.width, height: img.height })
        }
        img.src = src
      }
    }, [src])
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="cursor-pointer hover:opacity-80 transition-opacity duration-200 w-4/5 h-full mx-auto">
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={alt}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="border-none max-w-full max-h-full p-0 w-screen h-screen flex items-center justify-center bg-transparent backdrop-blur-md focus:outline-none">
          <div className="relative" style={{ width: `${dimensions.width * 0.8}px`, height: `${dimensions.height * 0.8}px`, maxWidth: '80vw', maxHeight: '80vh' }}>
            <Image
              src={src}
              alt={alt}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
}