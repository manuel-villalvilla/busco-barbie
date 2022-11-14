module.exports = function(categories) {
    if (categories.trim().length === 0) throw new Error('categories is empty')
    if (!['soldaccessories','soldmodels','searchedaccessories','searchedmodels'].includes(categories)) throw new Error('wrong categories')
}