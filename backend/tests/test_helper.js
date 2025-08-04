const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'About my life',
    author: 'Marta Carson',
    url: '092839',
    likes: 7,
    __v: 0
  },
  {
    title: 'Life is good',
    author: 'Ricky Ricon',
    url: ';a;slslsldslkd',
    likes: 3,
    __v: 0
  },
  {
    title: 'Do not give up ',
    author: 'Martin Siopero',
    url: 'ls929283999',
    likes: 2,
    __v: 0
  },
  {
    title: 'YEAH',
    author: 'Laila',
    url: '92kdkdkdlsll',
    likes: 1,
    __v: 0
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb
}