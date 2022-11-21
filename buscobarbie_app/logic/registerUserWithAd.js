import axios from 'axios'
import {
    validateCountry,
    validateName,
    validatePassword,
    validateEmail,
    validateTitle,
    validateBody,
    validateProvince,
    validatePrice,
    validateCategories,
    validateArea,
    validatePhoneNumber,
    validateYear,
    validateTags
} from 'validators'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function (token, form, country_code, tags) {
    const {
        name: { value: name },
        email: { value: email },
        password: { value: password },
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

    validateCountry(country_code)
    validateName(name)
    validatePassword(password)
    validateEmail(email)
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
    formData.set('price', [price.number, price.negotiable])
    formData.delete('modelosTags')
    formData.delete('complementosTags')
    formData.append('tags', tags)

    const res = await axios.post(`${API_URL}/utils`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (res.data !== 'human') throw new Error('not a human')

    const res2 = await axios.post(`${API_URL}/users`, formData)

    return res2
}