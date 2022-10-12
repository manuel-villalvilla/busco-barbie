import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function (user) {
    return axios.post(`${API_URL}/users/google`, user)
}