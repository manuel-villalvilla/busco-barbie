import axios from 'axios'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (userId, adId, token) {
    // TODO validate inputs
    const payload = {
        userId,
        adId
    }

    const res = await axios.delete(`${API_URL}/ads`, {
        headers: { 
            Authorization: `Bearer ${token}`
        },
        data: payload
    })
    
    return res.data
}