import axios from 'axios'
import { validateEmail, validatePassword } from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (credentials, req) {
    validateEmail(credentials.email)
    validatePassword(credentials.password)

    const payload = {
        email: credentials.email,
        password: credentials.password,
    }
    
    try {
        const res = await axios.post(`${API_URL}/users/auth`, payload)
        return res.data
    } catch (error) {
        throw new Error(error.response.data.error)
    }
}