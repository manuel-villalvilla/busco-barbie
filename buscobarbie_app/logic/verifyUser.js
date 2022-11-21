import { validateMongoId } from "validators";
import axios from 'axios'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (id, token) {
    validateMongoId(id)

    try {
    const res = await axios.patch(`${API_URL}/users`, { id, token })
    if (res.status === 204) return "ok"
    } catch(error) {
        const { response: { status, data: { error: message } } } = error
        if (status === 401 && message === 'wrong credentials') return 'alreadyVerified'

        return 'notOk'
    }
}