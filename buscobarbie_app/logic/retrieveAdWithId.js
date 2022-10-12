import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL

function retrieveAdWithId(country, adId) {
    // TODO VALIDATE AD ID
    return axios.get(
        `${API_URL}/ads/${adId}?country=${country}`)
        .then(res => res.data)
}

export default retrieveAdWithId