'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Layout } from '@/components/layout'

interface ImageData {
  imageUrl: string
  timestamp: number
}

export default function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    async function fetchImages() {
      try {
        const docRef = doc(db, "imageData", "IU8pbWm1r1Z0oTKzxJ6U")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const imageData = docSnap.data().images as ImageData[]
          imageData.sort((a, b) => b.timestamp - a.timestamp)
          setImages(imageData)
        } else {
          console.log("No images found!")
        }
      } catch (error) {
        console.error("Error fetching images:", error)
      }
    }

    fetchImages()
  }, [])

  useEffect(() => {
    if (images.length > 0) {
      const timer = setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [currentImageIndex, images])

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <h2 className="text-3xl font-bold text-orange-400">Our Gallery</h2>
        <div className="relative h-[60vh] overflow-hidden rounded-lg bg-gray-900/60 backdrop-blur">
          <AnimatePresence mode="wait">
            {images.length > 0 && (
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex].imageUrl}
                alt={`Image ${currentImageIndex + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-900/60 backdrop-blur"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={image.imageUrl}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-50" />
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

