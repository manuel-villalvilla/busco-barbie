const { connect, disconnect, Types: { ObjectId } } = require("mongoose")
const { Note, User } = require("../../models")
const { deleteNote } = require('..')
const { NotFoundError } = require("errors")
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST

describe('Delete Note', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(() => Promise.all([Note.deleteMany(), User.deleteMany()]))

    it('should succeed deleting a note', () => {
        const name = 'hulio'
        const email = 'hulio@ameba.com'
        const password = '123123123'

        return User.create({ name, email, password })
            .then(user => Note.create({ user: user.id })
                .then(note => Note.findById(note.id))
                .then(note => {
                    expect(note.user.toString()).toEqual(user.id.toString())
                    expect(note.text).toEqual('')
                    expect(note.visibility).toEqual('private')
                    expect(note.createdAt).toBeInstanceOf(Date)
                    return deleteNote(user.id, note.id)
                        .then(() => Note.findById(note.id))
                        .then(note => expect(note).toBeNull())
                })
            )
    })

    it('should fail with existing note but user not found', () => {
        const name = 'hulio'
        const email = 'hulio@ameba.com'
        const password = '123123123'

        return User.create({ name, email, password })
            .then(user => Note.create({ user: user.id }))
            .then(note => deleteNote(new ObjectId(), note.id))
            .then(() => {throw new Error('should not reach this point')})
            .catch(error => {
                expect(error).toBeInstanceOf(NotFoundError)
                expect(error.message).toEqual('user not found')
            })
    })

    it('should fail with existing user but note not found', () => {
        const name = 'hulio'
        const email = 'hulio@ameba.com'
        const password = '123123123'

        return User.create({ name, email, password })
            .then(user => Note.create({ user: user.id })
                .then(note => deleteNote(user.id, new ObjectId())))
            .then(() => {throw new Error('should not reach this point')})
            .catch(error => {
                expect(error).toBeInstanceOf(NotFoundError)
                expect(error.message).toEqual('note not found')
            })
    })

    afterAll(() => disconnect())
})