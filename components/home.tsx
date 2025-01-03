'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Facebook, Instagram, PhoneIcon as WhatsApp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface PriceData {
  price18Karat: number
  price20Karat: number
  price22Karat: number
  price24Karat: number
  priceSilver1: number
  priceSilver2: number
  goldwastageCharges: number
  goldmakingCharges: number
  wastageChargesSilver: number
  makingChargesSilver: number
}

export function Home() {
  const [priceData, setPriceData] = useState<PriceData | null>(null)

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const priceDocRef = doc(db, 'priceData', 'r8NuFZ36WWbuuBv5muZDXgRJIxB2')
        const docSnapshot = await getDoc(priceDocRef)
        if (docSnapshot.exists()) {
          setPriceData(docSnapshot.data() as PriceData)
        }
      } catch (error) {
        console.error('Error fetching price data:', error)
      }
    }

    fetchPriceData()
  }, [])

  return (
    <div className="space-y-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl">
          Welcome to Srinivasa Jewellers
        </h1>
        <h2 className="mt-2 text-xl font-semibold text-orange-200 sm:text-2xl">Bagepalli</h2>
        <p className="mx-auto mt-4 max-w-2xl text-gray-200">
          Where elegance meets craftsmanship. Explore our exquisite collection of fine gold jewelry, from timeless classics
          to unique statement pieces.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center gap-4"
      >
        <Button variant="ghost" className="group text-white hover:bg-green-600">
          <WhatsApp className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
          JOIN US
        </Button>
        <Button variant="ghost" className="group text-white hover:bg-pink-600">
          <Instagram className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
          FOLLOW
        </Button>
        <Button variant="ghost" className="group text-white hover:bg-blue-600">
          <Facebook className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
          FOLLOW
        </Button>
      </motion.div>

      {priceData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto max-w-2xl"
        >
          <Card className="border-orange-500/20 bg-gray-900/60 text-white backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-orange-400">Current Gold and Silver Prices</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold text-orange-300">Gold Prices (per gram)</h3>
                <p>18 Karat: ₹{priceData.price18Karat}</p>
                <p>20 Karat: ₹{priceData.price20Karat}</p>
                <p>22 Karat: ₹{priceData.price22Karat}</p>
                <p>24 Karat: ₹{priceData.price24Karat}</p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-orange-300">Silver Prices (per gram)</h3>
                <p>Silver 1: ₹{priceData.priceSilver1}</p>
                <p>Silver 2: ₹{priceData.priceSilver2}</p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-orange-300">Gold Charges</h3>
                <p>Wastage: {priceData.goldwastageCharges}%</p>
                <p>Making: ₹{priceData.goldmakingCharges}/g</p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-orange-300">Silver Charges</h3>
                <p>Wastage: {priceData.wastageChargesSilver}%</p>
                <p>Making: ₹{priceData.makingChargesSilver}/g</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mx-auto max-w-md"
      >
        <Card className="border-orange-500/20 bg-gray-900/60 text-white backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-orange-400">Gold and Silver Price Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-orange-200">Gold Type:</Label>
              <RadioGroup defaultValue="18" className="flex flex-wrap gap-4">
                {[18, 20, 22, 24].map((karat) => (
                  <div key={karat} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={karat.toString()}
                      id={`${karat}k`}
                      className="border-orange-500 text-orange-500"
                    />
                    <Label htmlFor={`${karat}k`} className="text-sm">
                      {karat} Karat
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-orange-200">
                Gold Weight (in grams):
              </Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                className="border-orange-500/20 bg-gray-800 text-white placeholder:text-gray-500 focus:border-orange-500"
                placeholder="Enter weight"
              />
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600">Calculate Price</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

