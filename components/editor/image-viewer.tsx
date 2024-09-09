'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import Image from 'next/image'

export default function ImageViewer({ src, alt }: { src: string, alt: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [aspectRatio, setAspectRatio] = useState(1)

    useEffect(() => {
      if (dimensions.width && dimensions.height) {
        setAspectRatio(dimensions.width / dimensions.height)
      }
    }, [dimensions])

    const getIntrinsicSize = () => {
      const maxWidth = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1000
      const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 800

      let width = dimensions.width
      let height = dimensions.height

      if (width > maxWidth) {
        width = maxWidth
        height = width / aspectRatio
      }

      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }

      return { width, height }
    }
  
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
          <div className="cursor-pointer hover:opacity-80 transition-opacity duration-200 w-4/5 mx-auto my-auto flex items-center justify-center h-full">
            <Image
              src={src}
              alt={alt}
              width={dimensions.width}
              height={dimensions.height}
              className="shadow-2xl"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="border-none max-w-full max-h-full p-0 w-screen h-screen flex items-center justify-center bg-transparent backdrop-blur-md focus:outline-none">
          <div className="relative">
            <Image
              src={src}
              alt={alt}
              {...getIntrinsicSize()}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
}