import axios from 'axios'
import { validateName, validatePassword } from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (id, token, name, pass1, pass2) {
    // TODO validate userId
    validateName(name)
    if (pass1) validatePassword(pass1)
    if (pass2) validatePassword(pass2)

    return await axios.patch(`${API_URL}/users/auth`, { id, name, pass1, pass2 }, { headers: { Authorization: `Bearer ${token}` } })

}