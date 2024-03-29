const request = require('supertest')
const app = require('../index')
const User = require('../models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/register-user').send({
        name: 'Andrew',
        password: 'MyPass777!'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Andrew',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass777!')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/user/login').send({
        name: userOne.name,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/user/login').send({
        email: userOne.email,
        password: 'thisisnotmypass'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/user/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticate user', async () => {
    await request(app)
        .delete('/user/me')
        .send()
        .expect(401)
})


// test('Should update valid user fields', async () => {
//     await request(app)
//         .patch('/user/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send({
//             name: 'Jess'
//         })
//         .expect(200)
//     const user = await User.findById(userOneId)
//     expect(user.name).toEqual('Jess')
// })

// test('Should not update invalid user fields', async () => {
//     await request(app)
//         .patch('/user/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send({
//             location: 'Philadelphia'
//         })
//         .expect(400)
// })