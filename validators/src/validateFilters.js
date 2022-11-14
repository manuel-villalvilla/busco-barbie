const { areas } = require('../../data')
const { FiltersError } = require('errors')
const { tags: { modelos, complementos }, years } = require('data')

module.exports = function (country, page, limit, province, search, categories, year, tags, sort) {
    const { ES, MX, AR } = areas
    const countries = ['AR', 'MX', 'ES']

    if (!countries.includes(country)) throw new FiltersError('Country filter not valid')
    if (page)
        if (isNaN(page) || page < 1) throw new FiltersError('Page filter not valid')

    if (limit)
        if (isNaN(limit) || limit < 1 || limit > 10) throw new FiltersError('Limit filter not valid')

    if (province) {
        if (country === 'ES') {
            if (!ES.includes(province)) throw new FiltersError('Province filter not valid')

        }
        else if (country === 'MX') {
            if (!MX.includes(province)) throw new FiltersError('Province filter not valid')

        }
        else if (country === 'AR') {
            if (!AR.includes(province)) throw new FiltersError('Province filter not valid')

        }
    }

    if (search)
        if (typeof search !== 'string' || search.trim().length > 30) throw new FiltersError('Search filter not valid')

    if (categories)
        if (typeof categories !== 'string' || categories !== 'soldaccessories' && categories !== 'soldmodels' && categories !== 'searchedaccessories' && categories !== 'searchedmodels')
            throw new FiltersError('Categories filter not valid')

    if (year) {
        if (typeof year !== 'string') throw new FiltersError('Year filter not valid')
        if (!years.includes(year)) throw new FiltersError('Year filter not valid')
    }

    if (tags && tags.length) {
        if (!(tags instanceof Array)) throw new FiltersError('Tags filter not valid')
        for (const tag of tags) {
            if (!modelos.includes(tag) && !complementos.includes(tag)) throw new FiltersError('Tags filter not valid')
        }
    }

    if (sort)
        if (typeof sort !== 'string' || sort !== 'firstPublished' && sort !== 'priceDes' && sort !== 'priceAsc')
            throw new FiltersError('Sort filter not valid')
}