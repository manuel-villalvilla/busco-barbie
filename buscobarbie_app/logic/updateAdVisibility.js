import axios from 'axios'
import { validateVisibility, validateMongoId } from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (visibility, token, userId, adId) {
    validateVisibility(visibility)
    validateMongoId(userId)
    validateMongoId(adId)

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