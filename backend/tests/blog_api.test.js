const assert = require('node:assert')
const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

let authToken

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash('do it', saltRounds) // 'do it' ---> plain password

  const user = new User({
    username: 'Pablo',
    passwordHash
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id
  }

  authToken = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

  await Blog.insertMany(helper.initialBlogs)
})



describe('related to users', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Rata',
      name: 'Maton',
      password: 'ole',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })


  test('invalid users are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Hamilton',
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned in JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

describe('viewing a specific blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'NEW BLOG',
      author: 'Reacon',
      url: 'https://........',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map((blog) => blog.title)
    assert(contents.includes(newBlog.title))
  })

  test('a blog without a token must not be added', async () => {
    const newBlog = {
      title: 'NEW BLOG',
      author: 'Reacon',
      url: 'https://........',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})


describe('viewing properties of blogs', () => {
  test('verifies that the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert(Object.hasOwn(blog, 'id'))
    })
  })


  test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      if (!Object.hasOwn(blog, 'likes')) {
        assert.strictEqual(blog.likes, 0)
      }
    })
  })

  test('if the title or url properties are missing, the backend responds with the status code 400 Bad Request.', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      author: 'no title or url',
      likes: 4
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

describe('deletion of a blog', () => {
  test('succeed with status 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToDelete = {
      title: 'to delete',
      author: 'mluukai',
      url: 'https://.....',
      likes: 2
    }
    // we post this blog and then delete it
    const postResponse = await api
      .post('/api/blogs')
      .send(blogToDelete)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api
      .delete(`/api/blogs/${postResponse.body.id}`) // did it with postResponse.body.id, because it didn't work with blogToDelete.id (it didn't exist)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const contents = blogsAtEnd.map(b => b.title)

    assert(!contents.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length) // not -1 because we added one and deleted one
  })
})

after(async () => {
  await mongoose.connection.close()
})