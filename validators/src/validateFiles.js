const imageTypeRegex = /image\/(png|jpg|jpeg|gif)/gm;

module.exports = function (files) {
    if (files.length)
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 6000000) throw new Error('file size over 6MB')

            if (files[i].type) {
                if (!files[i].type.match(imageTypeRegex)) throw new Error('wrong file type')
            }

            if (files[i].mimetype) {
                if (!files[i].mimetype.match(imageTypeRegex)) throw new Error('wrong file type')
            }
        }
}