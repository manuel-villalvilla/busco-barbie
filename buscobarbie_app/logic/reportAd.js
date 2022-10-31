import axios from "axios";
import { validateBody, validateMongoId, validateReportSelect } from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (token, select, body, adId) {
    validateBody(body)
    validateMongoId(adId)
    validateReportSelect(select)

    const res = await axios.post(`${API_URL}/utils`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    if (res.data !== 'human') throw new Error('not a human')

    return await axios.post(`${API_URL}/ads/report`, { select, body, adId })
}