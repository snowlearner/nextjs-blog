import { addDoc, collection } from 'firebase/firestore'
import { db } from './firebase'

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    const docRef = await addDoc(collection(db, "customerData"), formData)
    console.log("Document written with ID: ", docRef.id)
    return { success: true, message: "Customer data saved!" }
  } catch (error) {
    console.error("Error adding document: ", error)
    return { success: false, message: "Error saving customer data." }
  }
}

