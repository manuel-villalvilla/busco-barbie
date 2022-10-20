const options = ['suggestion', 'problem', 'other']

module.exports = function (option) {
    if (!options.includes(option)) throw new Error ('contact option not valid')
}