import axios from 'axios'
import { validateVisibility } from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (visibility, token, userId, adId) {
    validateVisibility(visibility)

    const payload = {
        visibility,
        userId,
        adId
    }

    const res = await axios.patch(
        `${API_URL}/ads/visibility`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res.data
}