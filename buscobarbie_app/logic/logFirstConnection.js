import axios from "axios"
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (ip, locale, country) {
    // TODO VALIDATE INPUTS

    return await axios.post(`${API_URL}/admin/connection`, { ip, locale, country })
}