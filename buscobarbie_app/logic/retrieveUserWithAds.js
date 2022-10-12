import axios from 'axios'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function (token) {
    // TODO Validate token?
    return axios.get(`${API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(pack => {
            if (Object.keys(pack.data).length === 0) return pack = {}
            return pack.data
        })
}