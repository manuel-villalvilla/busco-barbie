import { validateEmail } from 'validators'
import axios from 'axios'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (token, email) {
    validateEmail(email)

    const res = await axios.post(`${API_URL}/utils`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (res.data !== 'human') throw new Error('not a human')

    return await axios.post(`${API_URL}/users/recovery`, {email})
}