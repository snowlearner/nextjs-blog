'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Facebook, MessageCircle, Instagram, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Toaster } from "@/components/ui/toaster"
// import { Login } from '@/components/login'
import Login from '@/components/login'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'gallery', label: 'Gallery', href: '/gallery' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'contact', label: 'Contact', href: '/contact' },
    { id: 'login', label: 'Login', href: '#' },
  ]

  const socialLinks = [
    { id: 'whatsapp', label: 'JOIN US', href: 'https://wa.me/919538538568', icon: MessageCircle, color: '#25d366' },
    { id: 'instagram', label: 'FOLLOW', href: 'https://www.instagram.com/srinavasa_jewellery_works?igsh=Znk5bHJuMzVpMno1', icon: Instagram, color: '#ac2bac' },
    { id: 'facebook', label: 'FOLLOW', href: 'https://www.facebook.com/ranjithkumar.ranjithkumar.564/', icon: Facebook, color: '#3b5998' },
  ]

  const handleMenuItemClick = (id: string) => {
    setIsOpen(false)
    if (id === 'login') {
      setIsLoginOpen(true)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        if (pathname === '/login') {
          router.push('/admin')
        }
      } else {
        setUser(null)
        if (pathname === '/admin') {
          router.push('/')
        }
      }
    })

    return () => unsubscribe()
  }, [pathname, router])

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.push('/')
    }).catch((error) => {
      console.error('Error signing out:', error)
    })
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-600 via-purple-600 to-blue-600">
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900/80 backdrop-blur-md p-4 z-50 border-r border-gold-500"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Srinivasa Jewellers</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6 text-white" />
              </Button>
            </div>
            <div className="space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.id === 'login' ? '#' : item.href}
                  onClick={(e) => {
                    if (item.id === 'login') e.preventDefault();
                    handleMenuItemClick(item.id)
                  }}
                  className={cn(
                    'block w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex justify-between mt-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                    style={{ color: link.color }}
                  >
                    <link.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
            {user && (
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center flex-col">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                  <Image
                    src={user.photoURL || '/placeholder.svg?height=64&width=64'}
                    alt={user.displayName || 'User'}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <p className="text-white text-sm mb-2">{user.displayName || user.email}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:text-orange-500"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <main className={cn("flex-1 overflow-auto p-4 transition-all duration-300", isOpen ? "ml-64" : "ml-0")}>
        {children}
      </main>
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <Toaster />
    </div>
  )
}
