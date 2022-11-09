import axios from "axios";
import { validateMongoId } from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (ids) {
    for (const id of ids) validateMongoId(id)

    return axios.get(`${API_URL}/ads/favorites/${ids.toString()}`)
}