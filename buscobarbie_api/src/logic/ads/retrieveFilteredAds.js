const { Ad } = require("../../models")
const { validateFilters } = require('validators')

module.exports = function (page, limit, country, province, search, categories, year, tags, sort) {
    let tags2 = null
    if (typeof tags === 'string') tags2 = tags.split(',')

    validateFilters(country, page, limit, province, search, categories, year, tags2, sort)

    const queryParams = new function () {
        this['location.country'] = country

        if (province)
            this['location.province'] = province

        this.visibility = 'public'

        this.verified = true

        if (search) {
            this.$or = [
                { body: { $regex: new RegExp(search), $options: 'i' } },
                { title: { $regex: new RegExp(search), $options: 'i' } },
                { 'location.area': { $regex: new RegExp(search), $options: 'i' } },
                { tags: { $regex: new RegExp(search), $options: 'i' } }
            ]
        }

        if (categories) {
            this.categories = categories
        }

        if (year)
            this.year = year

        if (tags2 && tags2.length) {
            this.tags = { $in: tags2 }
        }
    }

    const srt = new function () {
        if (sort === undefined) this.createdAt = -1
        if (sort === 'firstPublished') this.createdAt = 1
        if (sort === 'priceDes') this.price = -1
        if (sort === 'priceAsc') this.price = 1
    }
    
    return Ad.find(queryParams).limit(limit * 1).skip((page - 1) * limit).sort(srt).lean()
        .then(ads => {
            return Ad.countDocuments(queryParams)
                .then(count => {
                    return {
                        ads,
                        totalPages: Math.ceil(count / limit),
                        currentPage: page,
                        count
                    }
                })
        })
}