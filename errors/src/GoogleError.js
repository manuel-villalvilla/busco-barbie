module.exports = class GoogleError extends Error {
    constructor(message) {
        super(message)

        this.name = GoogleError.name
    }
}