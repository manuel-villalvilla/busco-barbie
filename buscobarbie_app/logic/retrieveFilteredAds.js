import axios from "axios";
import { validateFilters } from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

function retrieveFilteredAds(country, page, limit, province, search, categories, year, tags, sort) {
    validateFilters(country, page, limit, province, search, categories, year, tags, sort)
    return axios.get(
        `${API_URL}/ads?country=${country}${page ? `&page=${page}` : ''}${limit ? `&limit=${limit}` : ''}${province ? `&province=${province}` : ''}${search ? `&search=${search}` : ''}${categories ? `&categories=${categories}` : ''}${year ? `&year=${year}` : ''}${tags ? `&tags=${tags.toString()}` : ''}${sort ? `&sort=${sort}` : ''}`)
        .then(res => res.data)
}

export default retrieveFilteredAds