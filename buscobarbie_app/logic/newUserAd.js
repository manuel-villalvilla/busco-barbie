import axios from 'axios'
import {
    validateCountry,
    validateTitle,
    validateBody,
    validateProvince,
    validatePrice,
    validateCategories,
    validateArea,
    validatePhoneNumber,
    validateYear,
    validateTags,
    validateMongoId
} from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (tokenFromApi, id, form, country_code, tags) {
    const {
        title: { value: title },
        body: { value: body },
        province: { value: province },
        area: { value: area },
        phone: { value: phone },
        price: { value: priceNumber },
        categories: { value: categories },
        negotiable,
        accept
    } = form

    const price = {
        number: priceNumber,
        negotiable: negotiable.checked ? true : false
    }

    validateMongoId(id)
    validateCountry(country_code)
    validateTitle(title)
    validateBody(body)
    validateProvince(province)
    validateArea(area)
    validatePhoneNumber(phone)
    validatePrice(price)
    validateCategories(categories)
    if (form.year) validateYear(form.year.value)
    if (tags.length) validateTags(tags)
    if (!accept.checked) throw new Error('checkbox required')

    const formData = new FormData(form)
    formData.append('country_code', country_code)
    formData.append('id', id)
    formData.set('price', [price.number, price.negotiable])
    formData.delete('complementosTags')
    formData.delete('modelosTags')
    formData.append('tags', tags)

    return axios.post(`${API_URL}/ads`, formData, {
        headers: {
            Authorization: `Bearer ${tokenFromApi}`
        }
    })
        .catch(error => { throw new Error(error) })
}