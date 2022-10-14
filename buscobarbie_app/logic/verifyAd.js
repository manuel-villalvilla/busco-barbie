import axios from 'axios'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (boolean, adId, token) {
    if (boolean) {
        const res = await axios.patch(`
        ${API_URL}/admin/ads`,
            { adId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res
    }
    else {
        const res = await axios.delete(`
        ${API_URL}/admin/ads`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {adId}
        })
        return res
    }
}