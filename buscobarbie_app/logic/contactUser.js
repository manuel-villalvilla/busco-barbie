import axios from 'axios'
import { validateEmail, validateMongoId, validateName, validateBody } from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (token, name, email, body, adUser) {
    validateName(name)
    validateEmail(email)
    validateBody(body)
    validateMongoId(adUser)

    const payload = {
        name, 
        email,
        body,
        adUser
    }

    const res1 = await axios.post(`${API_URL}/utils`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    if (res1.data !== 'human') throw new Error('not a human')

    return axios.post(`${API_URL}/users/contact`, payload)
        .then(res => {
            return res
        })
        .catch(error => {throw new Error(error.response.data.error)})
}