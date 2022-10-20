module.exports = function (name) {
    if (name.length > 41) name = name.slice(39)
    if (name.includes(' ')) name = name.split(' ')[0]
    return name
}