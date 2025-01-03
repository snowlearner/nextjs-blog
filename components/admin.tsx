// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { doc, getDoc, setDoc, collection, getDocs, writeBatch, deleteDoc } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { useToast } from '@/hooks/use-toast'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// interface PriceData {
//   price18Karat: number
//   price20Karat: number
//   price22Karat: number
//   price24Karat: number
//   priceSilver1: number
//   priceSilver2: number
//   goldwastageCharges: number
//   goldmakingCharges: number
//   wastageChargesSilver: number
//   makingChargesSilver: number
// }

// interface Product {
//   id: string
//   name: string
//   category: string
//   weight: number
//   imageUrl: string
// }

// interface Image {
//   id: string
//   url: string
//   timestamp: number
// }

// export function Admin() {
//   const [user, setUser] = useState<any>(null)
//   const [priceData, setPriceData] = useState<PriceData>({
//     price18Karat: 0,
//     price20Karat: 0,
//     price22Karat: 0,
//     price24Karat: 0,
//     priceSilver1: 0,
//     priceSilver2: 0,
//     goldwastageCharges: 0,
//     goldmakingCharges: 0,
//     wastageChargesSilver: 0,
//     makingChargesSilver: 0,
//   })
//   const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
//     name: '',
//     category: '',
//     weight: 0,
//     imageUrl: '',
//   })
//   const [products, setProducts] = useState<Product[]>([])
//   const [selectedProductId, setSelectedProductId] = useState('')
//   const [contactDetails, setContactDetails] = useState<any[]>([])
//   const [newImageUrl, setNewImageUrl] = useState('')
//   const [images, setImages] = useState<Image[]>([])
//   const [selectedImageId, setSelectedImageId] = useState('')
//   const router = useRouter()
//   const { toast } = useToast()

//   useEffect(() => {
//     const checkAuth = async () => {
//       const userId = localStorage.getItem('userId')
//       const userEmail = localStorage.getItem('userEmail')

//       if (!userId || !userEmail) {
//         router.push('/login')
//         return
//       }

//       try {
//         const userDoc = await getDoc(doc(db, 'users', userId))
//         if (userDoc.exists() && userDoc.data().email === userEmail) {
//           setUser({ id: userId, email: userEmail })
//           fetchPriceData()
//           fetchProducts()
//           fetchContactDetails()
//           fetchImages()
//         } else {
//           throw new Error('User not found or email mismatch')
//         }
//       } catch (error) {
//         console.error('Authentication error:', error)
//         router.push('/login')
//       }
//     }

//     checkAuth()
//   }, [router])

//   const fetchPriceData = async () => {
//     try {
//       const priceDocRef = doc(db, 'priceData', 'r8NuFZ36WWbuuBv5muZDXgRJIxB2')
//       const docSnapshot = await getDoc(priceDocRef)
//       if (docSnapshot.exists()) {
//         setPriceData(docSnapshot.data() as PriceData)
//       }
//     } catch (error) {
//       console.error('Error fetching price data:', error)
//     }
//   }

//   const handlePriceUpdate = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const priceDocRef = doc(db, 'priceData', 'r8NuFZ36WWbuuBv5muZDXgRJIxB2')
//       await setDoc(priceDocRef, priceData)
//       toast({
//         title: 'Prices Updated',
//         description: 'The price data has been successfully updated.',
//       })
//     } catch (error) {
//       console.error('Error updating prices:', error)
//       toast({
//         title: 'Update Failed',
//         description: 'There was an error updating the prices. Please try again.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const handleAddProduct = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const productsRef = collection(db, 'productData')
//       const newDocRef = doc(productsRef)
//       await setDoc(newDocRef, {
//         products: [newProduct]
//       })
//       toast({
//         title: 'Product Added',
//         description: 'The new product has been successfully added.',
//       })
//       setNewProduct({ name: '', category: '', weight: 0, imageUrl: '' })
//       fetchProducts()
//     } catch (error) {
//       console.error('Error adding product:', error)
//       toast({
//         title: 'Add Product Failed',
//         description: 'There was an error adding the product. Please try again.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const fetchProducts = async () => {
//     try {
//       const productsRef = collection(db, 'productData')
//       const querySnapshot = await getDocs(productsRef)
//       const fetchedProducts: Product[] = []
//       querySnapshot.forEach((doc) => {
//         const data = doc.data()
//         data.products.forEach((product: Omit<Product, 'id'>) => {
//           fetchedProducts.push({ id: doc.id, ...product })
//         })
//       })
//       setProducts(fetchedProducts)
//     } catch (error) {
//       console.error('Error fetching products:', error)
//     }
//   }

//   const handleDeleteProduct = async () => {
//     if (!selectedProductId) return
//     try {
//       const productDoc = await getDoc(doc(db, 'productData', selectedProductId))
//       if (productDoc.exists()) {
//         const products = productDoc.data().products
//         const updatedProducts = products.filter((p: Product) => p.name !== selectedProductId)
//         if (updatedProducts.length === 0) {
//           await deleteDoc(doc(db, 'productData', selectedProductId))
//         } else {
//           await setDoc(doc(db, 'productData', selectedProductId), { products: updatedProducts })
//         }
//         toast({
//           title: 'Product Deleted',
//           description: 'The product has been successfully deleted.',
//         })
//         fetchProducts()
//       }
//     } catch (error) {
//       console.error('Error deleting product:', error)
//       toast({
//         title: 'Delete Failed',
//         description: 'There was an error deleting the product. Please try again.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const fetchContactDetails = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, 'customerData'))
//       const details = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
//       setContactDetails(details)
//     } catch (error) {
//       console.error('Error fetching contact details:', error)
//     }
//   }

//   const handleDeleteAllCustomers = async () => {
//     if (window.confirm('Are you sure you want to delete all customer data?')) {
//       try {
//         const batch = writeBatch(db)
//         contactDetails.forEach((contact) => {
//           const docRef = doc(db, 'customerData', contact.id)
//           batch.delete(docRef)
//         })
//         await batch.commit()
//         setContactDetails([])
//         toast({
//           title: 'Customers Deleted',
//           description: 'All customer data has been successfully deleted.',
//         })
//       } catch (error) {
//         console.error('Error deleting customers:', error)
//         toast({
//           title: 'Delete Failed',
//           description: 'There was an error deleting customer data. Please try again.',
//           variant: 'destructive',
//         })
//       }
//     }
//   }

//   const fetchImages = async () => {
//     try {
//       const imageDocRef = doc(db, 'imageData', 'IU8pbWm1r1Z0oTKzxJ6U')
//       const docSnapshot = await getDoc(imageDocRef)
//       if (docSnapshot.exists()) {
//         const imageData = docSnapshot.data().images as Image[]
//         setImages(imageData)
//       }
//     } catch (error) {
//       console.error('Error fetching images:', error)
//     }
//   }

//   const handleAddImage = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const imageDocRef = doc(db, 'imageData', 'IU8pbWm1r1Z0oTKzxJ6U')
//       const newImage: Image = {
//         id: Date.now().toString(),
//         url: newImageUrl,
//         timestamp: Date.now(),
//       }
//       await setDoc(imageDocRef, {
//         images: [...images, newImage]
//       }, { merge: true })
//       toast({
//         title: 'Image Added',
//         description: 'The new image has been successfully added.',
//       })
//       setNewImageUrl('')
//       fetchImages()
//     } catch (error) {
//       console.error('Error adding image:', error)
//       toast({
//         title: 'Add Image Failed',
//         description: 'There was an error adding the image. Please try again.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const handleDeleteImage = async () => {
//     if (!selectedImageId) return
//     try {
//       const imageDocRef = doc(db, 'imageData', 'IU8pbWm1r1Z0oTKzxJ6U')
//       const updatedImages = images.filter(img => img.id !== selectedImageId)
//       await setDoc(imageDocRef, { images: updatedImages })
//       toast({
//         title: 'Image Deleted',
//         description: 'The image has been successfully deleted.',
//       })
//       fetchImages()
//     } catch (error) {
//       console.error('Error deleting image:', error)
//       toast({
//         title: 'Delete Failed',
//         description: 'There was an error deleting the image. Please try again.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('userId')
//     localStorage.removeItem('userEmail')
//     router.push('/login')
//   }

//   if (!user) {
//     return <div>Loading...</div>
//   }

//   return (
//     <div className="space-y-6 p-6">
//       <Card className="border-orange-500/20 bg-gray-900/60 text-white backdrop-blur">
//         <CardHeader>
//           <CardTitle className="text-2xl text-orange-400">Admin Dashboard</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div>
//             <h3 className="text-xl font-semibold text-orange-300">Update Prices</h3>
//             <form onSubmit={handlePriceUpdate} className="mt-4 grid gap-4 sm:grid-cols-2">
//               {Object.entries(priceData).map(([key, value]) => (
//                 <div key={key} className="space-y-2">
//                   <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
//                   <Input
//                     id={key}
//                     type="number"
//                     value={value}
//                     onChange={(e) => setPriceData({ ...priceData, [key]: parseFloat(e.target.value) })}
//                     className="border-orange-500/20 bg-gray-800 text-white"
//                   />
//                 </div>
//               ))}
//               <Button type="submit" className="col-span-full bg-orange-500 hover:bg-orange-600">
//                 Update Prices
//               </Button>
//             </form>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-orange-300">Add New Product</h3>
//             <form onSubmit={handleAddProduct} className="mt-4 space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="product-name">Product Name</Label>
//                 <Input
//                   id="product-name"
//                   value={newProduct.name}
//                   onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//                   className="border-orange-500/20 bg-gray-800 text-white"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="product-category">Category</Label>
//                 <Select
//                   value={newProduct.category}
//                   onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
//                 >
//                   <SelectTrigger className="border-orange-500/20 bg-gray-800 text-white">
//                     <SelectValue placeholder="Select category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="24 Karat">24 Karat</SelectItem>
//                     <SelectItem value="22 Karat">22 Karat</SelectItem>
//                     <SelectItem value="20 Karat">20 Karat</SelectItem>
//                     <SelectItem value="18 Karat">18 Karat</SelectItem>
//                     <SelectItem value="Silver 1">Silver 1</SelectItem>
//                     <SelectItem value="Silver 2">Silver 2</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="product-weight">Product Weight (grams)</Label>
//                 <Input
//                   id="product-weight"
//                   type="number"
//                   value={newProduct.weight}
//                   onChange={(e) => setNewProduct({ ...newProduct, weight: parseFloat(e.target.value) })}
//                   className="border-orange-500/20 bg-gray-800 text-white"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="product-image-url">Image URL</Label>
//                 <Input
//                   id="product-image-url"
//                   value={newProduct.imageUrl}
//                   onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
//                   className="border-orange-500/20 bg-gray-800 text-white"
//                   required
//                 />
//               </div>
//               <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
//                 Add Product
//               </Button>
//             </form>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-orange-300">Delete Product</h3>
//             <div className="mt-4 space-y-4">
//               <Select value={selectedProductId} onValueChange={setSelectedProductId}>
//                 <SelectTrigger className="border-orange-500/20 bg-gray-800 text-white">
//                   <SelectValue placeholder="Select product to delete" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {products.map((product) => (
//                     <SelectItem key={product.id} value={product.id}>
//                       {product.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Button
//                 onClick={handleDeleteProduct}
//                 className="w-full bg-red-500 hover:bg-red-600"
//                 disabled={!selectedProductId}
//               >
//                 Delete Product
//               </Button>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-orange-300">Add New Image</h3>
//             <form onSubmit={handleAddImage} className="mt-4 space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="image-url">Image URL</Label>
//                 <Input
//                   id="image-url"
//                   value={newImageUrl}
//                   onChange={(e) => setNewImageUrl(e.target.value)}
//                   className="border-orange-500/20 bg-gray-800 text-white"
//                   required
//                 />
//               </div>
//               <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
//                 Add Image
//               </Button>
//             </form>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-orange-300">Delete Image</h3>
//             <div className="mt-4 space-y-4">
//               <Select value={selectedImageId} onValueChange={setSelectedImageId}>
//                 <SelectTrigger className="border-orange-500/20 bg-gray-800 text-black">
//                   <SelectValue placeholder="Select image to delete" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {images.map((image) => (
//                     <SelectItem key={image.id} value={image.id}>
//                       {image.url}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Button
//                 onClick={handleDeleteImage}
//                 className="w-full bg-red-500 hover:bg-red-600"
//                 disabled={!selectedImageId}
//               >
//                 Delete Image
//               </Button>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-orange-300">Customer Contact Details</h3>
//             <div className="mt-4 space-y-4">
//               {contactDetails.map((contact) => (
//                 <div key={contact.id} className="rounded-lg bg-gray-800 p-4">
//                   <p><strong>Name:</strong> {contact.firstName} {contact.lastName}</p>
//                   <p><strong>Email:</strong> {contact.email}</p>
//                   <p><strong>Phone:</strong> {contact.phone}</p>
//                 </div>
//               ))}
//               <Button onClick={handleDeleteAllCustomers} className="w-full bg-red-500 hover:bg-red-600">
//                 Delete All Customer Data
//               </Button>
//             </div>
//           </div>

//           <Button onClick={handleLogout} className="w-full bg-gray-700 hover:bg-gray-600">
//             Logout
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, setDoc, collection, getDocs, writeBatch, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

interface Product {
  id: string
  name: string
  category: string
  weight: number
  imageUrl: string
}

interface Image {
  id: string
  url: string
  timestamp: number
}

export function Admin() {
  const [user, setUser] = useState<any>(null)
  const [priceData, setPriceData] = useState<PriceData>({
    price18Karat: 0,
    price20Karat: 0,
    price22Karat: 0,
    price24Karat: 0,
    priceSilver1: 0,
    priceSilver2: 0,
    goldwastageCharges: 0,
    goldmakingCharges: 0,
    wastageChargesSilver: 0,
    makingChargesSilver: 0,
  })
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    weight: 0,
    imageUrl: '',
  })
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [contactDetails, setContactDetails] = useState<any[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [images, setImages] = useState<Image[]>([])
  const [selectedImageId, setSelectedImageId] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const userId = localStorage.getItem('userId')
      const userEmail = localStorage.getItem('userEmail')

      if (!userId || !userEmail) {
        router.push('/login')
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (userDoc.exists() && userDoc.data().email === userEmail) {
          setUser({ id: userId, email: userEmail })
          fetchPriceData()
          fetchProducts()
          fetchContactDetails()
          fetchImages()
        } else {
          throw new Error('User not found or email mismatch')
        }
      } catch (error) {
        console.error('Authentication error:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

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

  const handlePriceUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const priceDocRef = doc(db, 'priceData', 'r8NuFZ36WWbuuBv5muZDXgRJIxB2')
      await setDoc(priceDocRef, priceData)
      toast({
        title: 'Prices Updated',
        description: 'The price data has been successfully updated.',
      })
    } catch (error) {
      console.error('Error updating prices:', error)
      toast({
        title: 'Update Failed',
        description: 'There was an error updating the prices. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const productsRef = collection(db, 'productData')
      const newDocRef = doc(productsRef)
      await setDoc(newDocRef, {
        products: [newProduct]
      })
      toast({
        title: 'Product Added',
        description: 'The new product has been successfully added.',
      })
      setNewProduct({ name: '', category: '', weight: 0, imageUrl: '' })
      fetchProducts()
    } catch (error) {
      console.error('Error adding product:', error)
      toast({
        title: 'Add Product Failed',
        description: 'There was an error adding the product. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'productData')
      const querySnapshot = await getDocs(productsRef)
      const fetchedProducts: Product[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        data.products.forEach((product: Omit<Product, 'id'>) => {
          fetchedProducts.push({ id: doc.id, ...product })
        })
      })
      setProducts(fetchedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProductId) return
    try {
      const productDoc = await getDoc(doc(db, 'productData', selectedProductId))
      if (productDoc.exists()) {
        const products = productDoc.data().products
        const updatedProducts = products.filter((p: Product) => p.id !== selectedProductId)
        if (updatedProducts.length === 0) {
          await deleteDoc(doc(db, 'productData', selectedProductId))
        } else {
          await setDoc(doc(db, 'productData', selectedProductId), { products: updatedProducts })
        }
        toast({
          title: 'Product Deleted',
          description: 'The product has been successfully deleted.',
        })
        fetchProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: 'Delete Failed',
        description: 'There was an error deleting the product. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const fetchContactDetails = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'customerData'))
      const details = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setContactDetails(details)
    } catch (error) {
      console.error('Error fetching contact details:', error)
    }
  }

  const handleDeleteAllCustomers = async () => {
    if (window.confirm('Are you sure you want to delete all customer data?')) {
      try {
        const batch = writeBatch(db)
        contactDetails.forEach((contact) => {
          const docRef = doc(db, 'customerData', contact.id)
          batch.delete(docRef)
        })
        await batch.commit()
        setContactDetails([])
        toast({
          title: 'Customers Deleted',
          description: 'All customer data has been successfully deleted.',
        })
      } catch (error) {
        console.error('Error deleting customers:', error)
        toast({
          title: 'Delete Failed',
          description: 'There was an error deleting customer data. Please try again.',
          variant: 'destructive',
        })
      }
    }
  }

  const fetchImages = async () => {
    try {
      const imageDocRef = doc(db, 'imageData', 'IU8pbWm1r1Z0oTKzxJ6U')
      const docSnapshot = await getDoc(imageDocRef)
      if (docSnapshot.exists()) {
        const imageData = docSnapshot.data().images as Image[]
        setImages(imageData)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const imageDocRef = doc(db, 'imageData', 'IU8pbWm1r1Z0oTKzxJ6U')
      const newImage: Image = {
        id: Date.now().toString(),
        url: newImageUrl,
        timestamp: Date.now(),
      }
      await setDoc(imageDocRef, {
        images: [...images, newImage],
      })
      setNewImageUrl('')
      fetchImages()
      toast({
        title: 'Image Added',
        description: 'The image has been successfully added.',
      })
    } catch (error) {
      console.error('Error adding image:', error)
      toast({
        title: 'Add Image Failed',
        description: 'There was an error adding the image. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Update Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePriceUpdate}>
              {/* Add fields to display and edit priceData */}
              <Label htmlFor="price18Karat">Price for 18 Karat</Label>
              <Input
                type="number"
                id="price18Karat"
                value={priceData.price18Karat}
                onChange={(e) => setPriceData({ ...priceData, price18Karat: +e.target.value })}
              />
              <Button type="submit">Update Prices</Button>
            </form>
          </CardContent>
        </Card>

        {/* Product Addition */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProduct}>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                value={newProduct.weight}
                type="number"
                onChange={(e) => setNewProduct({ ...newProduct, weight: +e.target.value })}
              />
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
              />
              <Button type="submit">Add Product</Button>
            </form>
          </CardContent>
        </Card>

        {/* Product Deletion */}
        <Card>
          <CardHeader>
            <CardTitle>Delete Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleDeleteProduct}>Delete Selected Product</Button>
          </CardContent>
        </Card>

        {/* Customer Management */}
        <Button onClick={handleDeleteAllCustomers}>Delete All Customer Data</Button>
      </div>
    </>
  )
}
