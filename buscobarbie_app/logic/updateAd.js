import axios from 'axios'
import {
    validateTitle,
    validateBody,
    validateProvince,
    validatePrice,
    validateCategories,
    validateArea,
    validatePhoneNumber,
    validateTags,
    validateYear,
    validateMongoId
} from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function (form, token, userId, adId, tags) {
    const {
        title: {
            value: title 
        },
        body: {
            value: body
        },
        province: {
            value: province
        },
        area: {
            value: area
        },
        phone: {
            value: phone
        },
        price: {
            value: price
        },
        categories: {
            value: categories
        },
        accept
    } = form
    
    validateTitle(title)
    validateBody(body)
    validateProvince(province)
    validateArea(area)
    validatePhoneNumber(phone)
    validatePrice(price)
    validateCategories(categories)
    if (tags.length) validateTags(tags)
    if (form.year) validateYear(form.year.value)
    if (!accept.checked) throw new Error('checkbox required')
    validateMongoId(userId)
    validateMongoId(adId)

    const formData = new FormData(form)
    formData.append('userId', userId)
    formData.append('adId', adId)
    formData.delete('modelosTags')
    formData.delete('complementosTags')
    formData.append('tags', tags)

    return axios.patch(`${API_URL}/ads`, formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => {
            return res.data
        })
        .catch(error => { throw new Error(error) })
}