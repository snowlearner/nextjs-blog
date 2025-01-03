'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface Product {
  id: string
  name: string
  category: string
  weight: string
  imageUrl: string
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsRef = collection(db, "productData")
        const querySnapshot = await getDocs(productsRef)

        const productsList: Product[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          data.products.forEach((product: Product) => {
            productsList.push({
              id: doc.id,
              name: product.name,
              category: product.category,
              weight: product.weight,
              imageUrl: product.imageUrl,
            })
          })
        })

        setProducts(productsList)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold text-orange-400">Our Exclusive Products</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <motion.div
            key={`${product.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-orange-500/20 bg-gray-900/60 text-white backdrop-blur">
              <CardHeader className="p-0">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform hover:scale-110"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl text-orange-300">{product.name}</CardTitle>
                <p className="mt-2 text-sm text-gray-300">Category: {product.category}</p>
                <p className="text-sm text-gray-300">Weight: {product.weight}</p>
              </CardContent>
              <CardFooter className="p-4">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Check Price</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

