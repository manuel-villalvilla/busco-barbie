module.exports = class VerificationError extends Error {
    constructor(message) {
        super(message)

        this.name = VerificationError.name
    }
}