module.exports = class CredentialsError extends Error {
    constructor(message) {
        super(message)

        this.name = CredentialsError.name
    }
}