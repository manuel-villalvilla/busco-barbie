module.exports = class LimitError extends Error {
    constructor(message) {
        super(message)

        this.name = LimitError.name
    }
}