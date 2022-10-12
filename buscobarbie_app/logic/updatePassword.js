import { validatePassword } from 'validators'
import axios from 'axios'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (token, id, pass1, pass2) {
    validatePassword(pass1)
    validatePassword(pass2)

    await axios.post(`${API_URL}/users/pass`, { pass1, pass2, id }, { headers: { Authorization: `Bearer ${token}` } })
}