import axios from "axios"
import { validateCountry } from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (country) {
    validateCountry(country)

    const res = await axios.get(`${API_URL}/ads/xml/${country}`)
    if (res.status === 200) return res.data
    else return []
}