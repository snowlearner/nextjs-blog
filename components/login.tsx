'use client'

import { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyDt_ePCpK6FVGe4tmJgMaz-DmlvGQm5wk4",
  authDomain: "srinivasa-jewellers.firebaseapp.com",
  projectId: "srinivasa-jewellers",
  storageBucket: "srinivasa-jewellers.firebasestorage.app",
  messagingSenderId: "861877666540",
  appId: "1:861877666540:web:f1c4557fdb19732ffc1bc9",
  measurementId: "G-WV4L6HXEXF"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Login({ isOpen, onClose }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('')

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        await setDoc(doc(db, "users", userCredential.user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        })
        setMessage('Account created successfully!')
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password)
        setMessage('Logged in successfully!')
        if (auth.currentUser) {
          localStorage.setItem('userId', auth.currentUser.uid)
          localStorage.setItem('userEmail', auth.currentUser.email || '')
          router.push('/admin')
        }
      }
    } catch (error: unknown) {
      console.error("Error:", error)
      if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage('An unknown error occurred.')
      }
    }
  }

  if (!isOpen) return null; // Prevent rendering if the modal is closed.

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="max-w-md mx-auto bg-gray-900 text-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label htmlFor="firstName" className="block mb-1">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md text-black"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md text-black"
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="block mb-1">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-black"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-black"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-blue-300 hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
        {message && <p className="mt-4 text-center text-gold-400">{message}</p>}
        <button
          onClick={onClose}
          className="mt-4 text-white text-center block w-full bg-red-500 hover:bg-red-600 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  )
}
