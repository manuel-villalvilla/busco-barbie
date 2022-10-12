const { FormatError } = require("errors");

module.exports = function (id) {
    const objectIdHexRegexp = /^[0-9A-Fa-f]{24}$/;

    if (!objectIdHexRegexp.test(id)) throw new FormatError('object id not valid')
}