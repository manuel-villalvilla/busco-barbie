import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (userId, token) {
    await axios.delete(`${API_URL}/users`, {
        headers: { 
            Authorization: `Bearer ${token}`
        },
        data: {userId}
    })
}