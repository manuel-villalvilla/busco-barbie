import { validateEmail } from 'validators'
import axios from 'axios'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (email) {
    validateEmail(email)

    return await axios.post(`${API_URL}/users/recovery`, {email})
}