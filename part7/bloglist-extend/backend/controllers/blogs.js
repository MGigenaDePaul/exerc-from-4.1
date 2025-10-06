const blogsRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId is missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url is missing' })
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', userExtractor, async (request, response) => {
  const { comment } = request.body
  console.log('comment', comment)
  const blog = await Blog.findById(request.params.id)

  blog.comments = blog.comments.concat(comment)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId is missing or not valid' })
  }

  if ( blog.user.toString() === user._id.toString() ) {
    response.status(204).end()
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const { likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = likes

  const savedBlog = await blog.save()
  response.status(200).json(savedBlog)
})

module.exports = blogsRouter
