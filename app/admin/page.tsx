'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, setDoc, collection, getDocs, writeBatch, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { useToast } from '@/components/ui/use-toast'
import { useToast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Layout } from '@/components/layout'

interface PriceData {
  price18Karat: number | string;
  price20Karat: number | string;
  price22Karat: number | string;
  price24Karat: number | string;
  priceSilver1: number | string;
  priceSilver2: number | string;
  goldwastageCharges: number | string;
  goldmakingCharges: number | string;
  wastageChargesSilver: number | string;
  makingChargesSilver: number | string;
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
  imageUrl: string
  timestamp: number
}

interface UserData {
  firstName: string
  lastName: string
  email: string
}

const initialPriceData: PriceData = {
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
}

export default function AdminPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [currentPriceData, setCurrentPriceData] = useState<PriceData | null>(null)
  const [priceData, setPriceData] = useState<PriceData>(() => {
    const emptyPriceData: PriceData = {
      price18Karat: '',
      price20Karat: '',
      price22Karat: '',
      price24Karat: '',
      priceSilver1: '',
      priceSilver2: '',
      goldwastageCharges: '',
      goldmakingCharges: '',
      wastageChargesSilver: '',
      makingChargesSilver: '',
    };
    return emptyPriceData;
  });
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    weight: 0,
    imageUrl: '',
  })
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [contactDetails, setContactDetails] = useState<any[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [images, setImages] = useState<Image[]>([])
  const [selectedImage, setSelectedImage] = useState('')
  const [showCustomers, setShowCustomers] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser
      if (!currentUser) {
        router.push('/')
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserData)
          fetchPriceData()
          fetchProducts()
          fetchContactDetails()
          fetchImages()
        } else {
          throw new Error('User not found')
        }
      } catch (error) {
        console.error('Authentication error:', error)
        router.push('/')
      }
    }

    checkAuth()
  }, [router])

  const fetchPriceData = async () => {
    try {
      const priceDocRef = doc(db, 'priceData', 'r8NuFZ36WWbuuBv5muZDXgRJIxB2')
      const docSnapshot = await getDoc(priceDocRef)
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as PriceData
        setCurrentPriceData(data)
        setPriceData({
          price18Karat: data.price18Karat.toString(),
          price20Karat: data.price20Karat.toString(),
          price22Karat: data.price22Karat.toString(),
          price24Karat: data.price24Karat.toString(),
          priceSilver1: data.priceSilver1.toString(),
          priceSilver2: data.priceSilver2.toString(),
          goldwastageCharges: data.goldwastageCharges.toString(),
          goldmakingCharges: data.goldmakingCharges.toString(),
          wastageChargesSilver: data.wastageChargesSilver.toString(),
          makingChargesSilver: data.makingChargesSilver.toString(),
        })
      }
    } catch (error) {
      console.error('Error fetching price data:', error)
    }
  }
// -------------------------------------------------------------------//
  // const handlePriceUpdate = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   try {
  //     const priceDocRef = doc(db, 'priceData', 'r8NuFZ36WWbuuBv5muZDXgRJIxB2')
  //     const updatedPriceData = Object.fromEntries(
  //       Object.entries(priceData).map(([key, value]) => [key, value === '' ? 0 : parseFloat(value)])
  //     );
  //     await setDoc(priceDocRef, updatedPriceData)
  //     setCurrentPriceData(updatedPriceData)
  //     setPriceData({
  //       price18Karat: '',
  //       price20Karat: '',
  //       price22Karat: '',
  //       price24Karat: '',
  //       priceSilver1: '',
  //       priceSilver2: '',
  //       goldwastageCharges: '',
  //       goldmakingCharges: '',
  //       wastageChargesSilver: '',
  //       makingChargesSilver: '',
  //     })
  //     toast({
  //       title: 'Prices Updated',
  //       description: 'The price data has been successfully updated.',
  //     })
  //   } catch (error) {
  //     console.error('Error updating prices:', error)
  //     toast({
  //       title: 'Update Failed',
  //       description: 'There was an error updating the prices. Please try again.',
  //       variant: 'destructive',
  //     })
  //   }
  // }
// -------------------------------------------------//

// -------- newly added code---------------------------//
// Define the PriceData type explicitly
type PriceData = {
  price18Karat: string;
  price20Karat: string;
  price22Karat: string;
  price24Karat: string;
  priceSilver1: string;
  priceSilver2: string;
  goldwastageCharges: string;
  goldmakingCharges: string;
  wastageChargesSilver: string;
  makingChargesSilver: string;
};

const handlePriceUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const priceDocRef = doc(db, 'priceData', 'r8NuFZ36WWbuuBv5muZDXgRJIxB2');

    // Parse the string values to numbers before saving to Firestore
    const updatedPriceData = {
      price18Karat: parseFloat(priceData.price18Karat) || 0,
      price20Karat: parseFloat(priceData.price20Karat) || 0,
      price22Karat: parseFloat(priceData.price22Karat) || 0,
      price24Karat: parseFloat(priceData.price24Karat) || 0,
      priceSilver1: parseFloat(priceData.priceSilver1) || 0,
      priceSilver2: parseFloat(priceData.priceSilver2) || 0,
      goldwastageCharges: parseFloat(priceData.goldwastageCharges) || 0,
      goldmakingCharges: parseFloat(priceData.goldmakingCharges) || 0,
      wastageChargesSilver: parseFloat(priceData.wastageChargesSilver) || 0,
      makingChargesSilver: parseFloat(priceData.makingChargesSilver) || 0,
    };

    await setDoc(priceDocRef, updatedPriceData);

    // Update currentPriceData (convert the numbers back to strings for the UI state if needed)
    setCurrentPriceData({
      price18Karat: updatedPriceData.price18Karat.toString(),
      price20Karat: updatedPriceData.price20Karat.toString(),
      price22Karat: updatedPriceData.price22Karat.toString(),
      price24Karat: updatedPriceData.price24Karat.toString(),
      priceSilver1: updatedPriceData.priceSilver1.toString(),
      priceSilver2: updatedPriceData.priceSilver2.toString(),
      goldwastageCharges: updatedPriceData.goldwastageCharges.toString(),
      goldmakingCharges: updatedPriceData.goldmakingCharges.toString(),
      wastageChargesSilver: updatedPriceData.wastageChargesSilver.toString(),
      makingChargesSilver: updatedPriceData.makingChargesSilver.toString(),
    });

    // Reset the form
    setPriceData({
      price18Karat: '',
      price20Karat: '',
      price22Karat: '',
      price24Karat: '',
      priceSilver1: '',
      priceSilver2: '',
      goldwastageCharges: '',
      goldmakingCharges: '',
      wastageChargesSilver: '',
      makingChargesSilver: '',
    });

    toast({
      title: 'Prices Updated',
      description: 'The price data has been successfully updated.',
    });
  } catch (error) {
    console.error('Error updating prices:', error);
    toast({
      title: 'Update Failed',
      description: 'There was an error updating the prices. Please try again.',
      variant: 'destructive',
    });
  }
};


// -------------------------------------------------//
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const productsRef = doc(db, 'productData', 'np6cJBFNPXdUpdnULNAF')
      const newProductWithId = {
        id: Date.now().toString(),
        ...newProduct
      }
      await updateDoc(productsRef, {
        products: arrayUnion(newProductWithId)
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
      const productsCollection = doc(db, 'productData', 'np6cJBFNPXdUpdnULNAF');
      const docSnap = await getDoc(productsCollection);

      if (docSnap.exists()) {
        setProducts(docSnap.data().products || []);
      } else {
        console.error('No products found');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  const handleDeleteProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast({
        title: 'Delete Failed',
        description: 'Please select a product to delete.',
        variant: 'destructive',
      });
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete the product: ${selectedProduct}?`);
    if (confirmDelete) {
      try {
        const productsCollection = doc(db, 'productData', 'np6cJBFNPXdUpdnULNAF');
        const docSnap = await getDoc(productsCollection);

        if (docSnap.exists()) {
          const productData = docSnap.data().products || [];
          const productToDelete = productData.find((product: Product) => product.id === selectedProduct);

          if (productToDelete) {
            await updateDoc(productsCollection, {
              products: arrayRemove(productToDelete),
            });
            toast({
              title: 'Product Deleted',
              description: 'The product has been successfully deleted.',
            });
            fetchProducts();
            setSelectedProduct('');
          } else {
            toast({
              title: 'Delete Failed',
              description: 'Product not found or invalid selection.',
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Delete Failed',
            description: 'Error fetching product data.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: 'Delete Failed',
          description: 'An error occurred while deleting the product. Please try again.',
          variant: 'destructive',
        });
      }
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
      const imagesCollection = doc(db, 'imageData', 'IU8pbWm1r1Z0oTKzxJ6U');
      const docSnap = await getDoc(imagesCollection);

      if (docSnap.exists()) {
        setImages(docSnap.data().images || []);
      } else {
        console.error('No images found');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const imageDocRef = doc(db, 'imageData', 'IU8pbWm1r1Z0oTKzxJ6U')
      const newImage: Image = {
        id: Date.now().toString(),
        imageUrl: newImageUrl,
        timestamp: Date.now(),
      }
      await updateDoc(imageDocRef, {
        images: arrayUnion(newImage)
      })
      toast({
        title: 'Image Added',
        description: 'The new image has been successfully added.',
      })
      setNewImageUrl('')
      fetchImages()
    } catch (error) {
      console.error('Error adding image:', error)
      toast({
        title: 'Add Image Failed',
        description: 'There was an error adding the image. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      toast({
        title: 'Delete Failed',
        description: 'Please select an image to delete.',
        variant: 'destructive',
      });
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete the image: ${selectedImage}?`);
    if (confirmDelete) {
      try {
        const imagesCollection = doc(db, 'imageData', 'IU8pbWm1r1Z0oTKzxJ6U');
        const docSnap = await getDoc(imagesCollection);

        if (docSnap.exists()) {
          const imageData = docSnap.data().images || [];
          const imageToDelete = imageData.find((image: Image) => image.id === selectedImage);

          if (imageToDelete) {
            await updateDoc(imagesCollection, {
              images: arrayRemove(imageToDelete),
            });
            toast({
              title: 'Image Deleted',
              description: 'The image has been successfully deleted.',
            });
            fetchImages();
            setSelectedImage('');
          } else {
            toast({
              title: 'Delete Failed',
              description: 'Image not found or invalid selection.',
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Delete Failed',
            description: 'Error fetching image data.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        toast({
          title: 'Delete Failed',
          description: 'An error occurred while deleting the image. Please try again.',
          variant: 'destructive',
        });
      }
    }
  }

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.push('/')
    }).catch((error) => {
      console.error('Error signing out:', error)
    })
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <Card className="border-orange-500/20 bg-gray-900/60 text-white backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-400">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-orange-300 mb-4">Logged In User Details</h3>
                <p><strong>First Name:</strong> {user.firstName}</p>
                <p><strong>Last Name:</strong> {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>

                <h3 className="text-xl font-semibold text-orange-300 mt-6 mb-4">Update Prices</h3>
                <div className="form-container">
                  <div className="form-card bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Please Update the Prices for Gold and Silver</h2>
                    <form onSubmit={handlePriceUpdate} className="space-y-4">
                      {Object.entries(priceData).map(([key, value]) => (
                        <div key={key} className="input-group">
                          <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}:</Label>
                          <Input
                            type="number"
                            id={key}
                            value={value}
                            onChange={(e) => setPriceData({ ...priceData, [key]: e.target.value })}
                            placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                            className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-orange-500"
                          />
                        </div>
                      ))}
                      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" id="savePrices">
                        Save Prices
                      </Button>
                    </form>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-orange-300 mb-4">Current Prices</h3>
                {currentPriceData && (
                  <div className="grid grid-cols-5 gap-2 text-gray-300 text-sm">
                    <div><strong>18K:</strong> ₹{currentPriceData.price18Karat}</div>
                    <div><strong>20K:</strong> ₹{currentPriceData.price20Karat}</div>
                    <div><strong>22K:</strong> ₹{currentPriceData.price22Karat}</div>
                    <div><strong>24K:</strong> ₹{currentPriceData.price24Karat}</div>
                    <div><strong>Silver 1:</strong> ₹{currentPriceData.priceSilver1}</div>
                    <div><strong>Silver 2:</strong> ₹{currentPriceData.priceSilver2}</div>
                    <div><strong>Gold Wastage:</strong> {currentPriceData.goldwastageCharges}%</div>
                    <div><strong>Gold Making:</strong> ₹{currentPriceData.goldmakingCharges}/g</div>
                    <div><strong>Silver Wastage:</strong> {currentPriceData.wastageChargesSilver}%</div>
                    <div><strong>Silver Making:</strong> ₹{currentPriceData.makingChargesSilver}/g</div>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-orange-300 mt-6 mb-4">Add New Product</h3>
                <div className="form-card bg-gray-800 p-4 rounded-lg">
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input
                        id="product-name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-category">Category</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger className="w-full mt-1 bg-gray-700 text-white border-gray-600">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24 Karat">24 Karat</SelectItem>
                          <SelectItem value="22 Karat">22 Karat</SelectItem>
                          <SelectItem value="20 Karat">20 Karat</SelectItem>
                          <SelectItem value="18 Karat">18 Karat</SelectItem>
                          <SelectItem value="Silver 1">Silver 1</SelectItem>
                          <SelectItem value="Silver 2">Silver 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="product-weight">Product Weight (grams)</Label>
                      <Input
                        id="product-weight"
                        type="number"
                        value={newProduct.weight || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, weight: parseFloat(e.target.value) || 0 })}
                        className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-image-url">Image URL</Label>
                      <Input
                        id="product-image-url"
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-orange-500"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                      Add Product
                    </Button>
                  </form>
                </div>

                <h3 className="text-xl font-semibold text-orange-300 mt-6 mb-4">Delete Product</h3>
                <div className="form-card bg-gray-800 p-4 rounded-lg">
                  <form onSubmit={handleDeleteProduct} className="space-y-4">
                    <div>
                      <Label htmlFor="product-select">Select Product to Delete</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                          <SelectValue placeholder="Select product to delete" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={`product-${product.id}`} value={product.id}>
                              {product.name} - {product.weight}g ({product.category})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={!selectedProduct}>
                      Delete Product
                    </Button>
                  </form>
                </div>

                <h3 className="text-xl font-semibold text-orange-300 mt-6 mb-4">Add New Image</h3>
                <div className="form-card bg-gray-800 p-4 rounded-lg">
                  <form onSubmit={handleAddImage} className="space-y-4">
                    <div>
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-orange-500"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                      Add Image
                    </Button>
                  </form>
                </div>

                <h3 className="text-xl font-semibold text-orange-300 mt-6 mb-4">Delete Image</h3>
                <div className="form-card bg-gray-800 p-4 rounded-lg">
                  <form onSubmit={handleDeleteImage} className="space-y-4">
                    <div>
                      <Label htmlFor="image-select">Select Image to Delete</Label>
                      <Select value={selectedImage} onValueChange={setSelectedImage}>
                        <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                          <SelectValue placeholder="Select image to delete" />
                        </SelectTrigger>
                        <SelectContent>
                          {images.map((image) => (
                            <SelectItem key={`image-${image.id}`} value={image.id}>
                              {image.imageUrl}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={!selectedImage}>
                      Delete Image
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button onClick={handleLogout} className="bg-gray-700 hover:bg-gray-600">
                Logout
              </Button>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
              <Button onClick={() => setShowCustomers(!showCustomers)} className="bg-blue-500 hover:bg-blue-600">
                {showCustomers ? 'Hide Customers' : 'View Customers'}
              </Button>
              <Button onClick={handleDeleteAllCustomers} className="bg-red-500 hover:bg-red-600">
                Delete All Customer Data
              </Button>
            </div>

            {showCustomers && (
              <div>
                <h3 className="text-xl font-semibold text-orange-300 mt-6 mb-4">Customer Contact Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {contactDetails.map((contact) => (
                    <div key={contact.id} className="bg-gray-800 p-4 rounded-lg">
                      <p><strong>Name:</strong> {contact.firstName} {contact.lastName}</p>
                      <p><strong>Email:</strong> {contact.email}</p>
                      <p><strong>Phone:</strong> {contact.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

