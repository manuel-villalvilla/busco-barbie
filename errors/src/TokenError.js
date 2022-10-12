module.exports = class TokenError extends Error {
    constructor(message) {
        super(message)

        this.name = TokenError.name
    }
}