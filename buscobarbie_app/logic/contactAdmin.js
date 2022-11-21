import axios from 'axios'
import { validateName, validateEmail, validateContactOptions, validateBody } from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (recaptchaToken, name, email, option, message) {
    validateName(name)
    validateEmail(email)
    validateContactOptions(option)
    validateBody(message)

    const payload = {
        name,
        email,
        option,
        message
    }

    const res = await axios.post(`${API_URL}/utils`, {}, {
        headers: {
            Authorization: `Bearer ${recaptchaToken}`
        }
    })

    if (res.data !== 'human') throw new Error('not a human')

    const res2 = await axios.post(`${API_URL}/admin`, {payload})
    return res2.status
}