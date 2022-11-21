import axios from "axios"
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (token) {
    const res = await axios.get(`${API_URL}/admin`, { headers: { Authorization: `Bearer ${token}` } })

    return res
}