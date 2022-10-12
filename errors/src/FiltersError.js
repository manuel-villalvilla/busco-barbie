class FiltersError extends Error {
    constructor(message) {
        super(message)

        this.name = FiltersError.name
    }
}

module.exports = FiltersError