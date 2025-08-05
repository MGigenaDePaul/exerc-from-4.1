const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

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

test('verifies that the unique identifier property of the blog posts is named id', async () => {

  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert(Object.hasOwn(blog, 'id'))
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'NEW BLOG',
    author: 'Reacon',
    url: 'https://lslslslsls',
    likes: 4,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map((blog) => blog.title)
  assert(contents.includes('NEW BLOG'))
})

after(async () => {
  await mongoose.connection.close()
})