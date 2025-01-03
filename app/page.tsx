'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { motion } from 'framer-motion'

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

export default function Page() {
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [calculatorState, setCalculatorState] = useState({
    goldType: '',
    goldWeight: '',
    silverType: '',
    silverWeight: '',
    result: null as string | null,
  })

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

  const handleCalculate = () => {
    if (!priceData) return

    let resultText = ''
    let totalGoldPrice = 0
    let totalSilverPrice = 0

    // Calculate Gold Price
    if (calculatorState.goldType && calculatorState.goldWeight) {
      const goldWeight = parseFloat(calculatorState.goldWeight)
      let goldPricePerGram
      let applyWastageMakingCharges = true

      switch (calculatorState.goldType) {
        case '18-Karat':
          goldPricePerGram = priceData.price18Karat
          break
        case '20-Karat':
          goldPricePerGram = priceData.price20Karat
          break
        case '22-Karat':
          goldPricePerGram = priceData.price22Karat
          break
        case '24-Karat':
          goldPricePerGram = priceData.price24Karat
          applyWastageMakingCharges = false
          break
        default:
          return
      }

      const goldPriceForWeight = goldPricePerGram * goldWeight

      if (applyWastageMakingCharges) {
        const wastageChargesForGold = goldPriceForWeight * (priceData.goldwastageCharges / 100)
        const makingChargesForGold = priceData.goldmakingCharges * goldWeight
        totalGoldPrice = goldPriceForWeight + wastageChargesForGold + makingChargesForGold
      } else {
        totalGoldPrice = goldPriceForWeight
      }

      resultText += `
        <table class="w-full mb-4 border-collapse border border-gray-300">
          <tr><td colspan="2" class="font-bold p-2 bg-transparent">Gold Price Breakup</td></tr>
          <tr><td class="p-2 border border-gray-300">Gold Type</td><td class="p-2 border border-gray-300">${calculatorState.goldType}</td></tr>
          <tr><td class="p-2 border border-gray-300">Weight</td><td class="p-2 border border-gray-300">${goldWeight.toFixed(3)} Grams</td></tr>
          <tr><td class="p-2 border border-gray-300">Price per Gram</td><td class="p-2 border border-gray-300">₹ ${goldPricePerGram.toFixed(2)}</td></tr>
      `

      if (applyWastageMakingCharges) {
        resultText += `
          <tr><td class="p-2 border border-gray-300">Wastage Charges (${priceData.goldwastageCharges}%)</td><td class="p-2 border border-gray-300">₹ ${(goldPriceForWeight * (priceData.goldwastageCharges / 100)).toFixed(2)}</td></tr>
          <tr><td class="p-2 border border-gray-300">Making Charges</td><td class="p-2 border border-gray-300">₹ ${(priceData.goldmakingCharges * goldWeight).toFixed(2)}</td></tr>
        `
      }

      resultText += `
        <tr><td class="p-2 border border-gray-300 font-bold">Total Gold Price</td><td class="p-2 border border-gray-300 font-bold">₹ ${totalGoldPrice.toFixed(2)}</td></tr>
        </table>
      `
    }

    // Calculate Silver Price
    if (calculatorState.silverType && calculatorState.silverWeight) {
      const silverWeight = parseFloat(calculatorState.silverWeight)
      let silverPricePerGram

      switch (calculatorState.silverType) {
        case 'Silver-1':
          silverPricePerGram = priceData.priceSilver1
          break
        case 'Silver-2':
          silverPricePerGram = priceData.priceSilver2
          break
        default:
          return
      }

      const silverPriceForWeight = silverPricePerGram * silverWeight
      const wastageChargesForSilver = silverPriceForWeight * (priceData.wastageChargesSilver / 100)
      const makingChargesForSilver = priceData.makingChargesSilver * silverWeight
      totalSilverPrice = silverPriceForWeight + wastageChargesForSilver + makingChargesForSilver

      resultText += `
        <table class="w-full mb-4 border-collapse border border-gray-300">
          <tr><td colspan="2" class="font-bold p-2 bg-transparent">Silver Price Breakup</td></tr>
          <tr><td class="p-2 border border-gray-300">Silver Type</td><td class="p-2 border border-gray-300">${calculatorState.silverType}</td></tr>
          <tr><td class="p-2 border border-gray-300">Weight</td><td class="p-2 border border-gray-300">${silverWeight.toFixed(3)} Grams</td></tr>
          <tr><td class="p-2 border border-gray-300">Price per Gram</td><td class="p-2 border border-gray-300">₹ ${silverPricePerGram.toFixed(2)}</td></tr>
          <tr><td class="p-2 border border-gray-300">Wastage Charges (${priceData.wastageChargesSilver}%)</td><td class="p-2 border border-gray-300">₹ ${wastageChargesForSilver.toFixed(2)}</td></tr>
          <tr><td class="p-2 border border-gray-300">Making Charges</td><td class="p-2 border border-gray-300">₹ ${makingChargesForSilver.toFixed(2)}</td></tr>
          <tr><td class="p-2 border border-gray-300 font-bold">Total Silver Price</td><td class="p-2 border border-gray-300 font-bold">₹ ${totalSilverPrice.toFixed(2)}</td></tr>
        </table>
      `
    }

    // Gross Total
    const grossTotal = totalGoldPrice + totalSilverPrice
    resultText += `
      <table class="w-full border-collapse border border-gray-300">
        <tr><td class="p-2 border border-gray-300 font-bold">Gross Total</td><td class="p-2 border border-gray-300 font-bold">₹ ${grossTotal.toFixed(2)}</td></tr>
      </table>
    `

    setCalculatorState(prev => ({ ...prev, result: resultText }))
  }

  return (
    <Layout>
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

        {priceData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mx-auto max-w-2xl border-orange-500/20 bg-gray-900/60 text-white backdrop-blur">
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
                {/* <div>
                  <h3 className="mb-2 font-semibold text-orange-300">Gold Charges</h3>
                  <p>Wastage: {priceData.goldwastageCharges}%</p>
                  <p>Making: ₹{priceData.goldmakingCharges}/g</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-orange-300">Silver Charges</h3>
                  <p>Wastage: {priceData.wastageChargesSilver}%</p>
                  <p>Making: ₹{priceData.makingChargesSilver}/g</p>
                </div> */}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto max-w-2xl"
        >
          <Card className="border-orange-500/20 bg-gray-900/60 text-white backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-orange-400">Gold and Silver Price Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-orange-200">Gold Type:</Label>
                <RadioGroup
                  value={calculatorState.goldType}
                  onValueChange={(value) => setCalculatorState(prev => ({ ...prev, goldType: value }))}
                  className="flex flex-wrap gap-4"
                >
                  {['18-Karat', '20-Karat', '22-Karat', '24-Karat'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={type}
                        id={`gold-${type}`}
                        className="border-orange-500 text-orange-500"
                      />
                      <Label htmlFor={`gold-${type}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gold-weight" className="text-orange-200">
                  Gold Weight (in grams):
                </Label>
                <Input
                  id="gold-weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={calculatorState.goldWeight}
                  onChange={(e) => setCalculatorState(prev => ({ ...prev, goldWeight: e.target.value }))}
                  className="border-orange-500/20 bg-gray-800 text-white placeholder:text-gray-500 focus:border-orange-500"
                  placeholder="Enter gold weight"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-orange-200">Silver Type:</Label>
                <RadioGroup
                  value={calculatorState.silverType}
                  onValueChange={(value) => setCalculatorState(prev => ({ ...prev, silverType: value }))}
                  className="flex flex-wrap gap-4"
                >
                  {['Silver-1', 'Silver-2'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={type}
                        id={`silver-${type}`}
                        className="border-orange-500 text-orange-500"
                      />
                      <Label htmlFor={`silver-${type}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="silver-weight" className="text-orange-200">
                  Silver Weight (in grams):
                </Label>
                <Input
                  id="silver-weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={calculatorState.silverWeight}
                  onChange={(e) => setCalculatorState(prev => ({ ...prev, silverWeight: e.target.value }))}
                  className="border-orange-500/20 bg-gray-800 text-white placeholder:text-gray-500 focus:border-orange-500"
                  placeholder="Enter silver weight"
                />
              </div>
              <Button onClick={handleCalculate} className="w-full bg-orange-500 hover:bg-orange-600">Calculate Price</Button>
              {calculatorState.result && (
                <div className="mt-4">
                  <h3 className="mb-2 text-lg font-semibold text-orange-300">Calculation Result:</h3>
                  <div dangerouslySetInnerHTML={{ __html: calculatorState.result }} className="text-sm" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  )
}

