import axios from "axios";
import { validateMongoId } from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

function retrieveAdWithId(country, adId) {
    validateMongoId(adId)
    
    return axios.get(
        `${API_URL}/ads/${adId}?country=${country}`)
        .then(res => res.data)
}

export default retrieveAdWithId