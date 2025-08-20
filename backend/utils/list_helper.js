const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const initialValue = 0
  return blogs.reduce((accumulator, currentValue) => accumulator + currentValue.likes, initialValue)
}

const favoriteBlog = (blogs) => {
  let maxLikes = blogs[0].likes
  let favoriteIndex = 0
  for (let i = 1; i < blogs.length; i++){
    if (blogs[i].likes > maxLikes) {
      maxLikes = blogs[i].likes
      favoriteIndex = i  // index of the favoriteBlog
    }
  }
  return blogs[favoriteIndex]
}

const mostBlogs = (blogs) => {
  const grouped = _.groupBy(blogs, 'author')

  const counts = _.map(grouped, (authorBlogs, author) => ({
    author,
    blogs: authorBlogs.length
  }))

  const authorMostBlogs = _.maxBy(counts, 'blogs')

  return authorMostBlogs
}
// ----------- FIRST IMPLEMENTATION of function WITHOUT LODASH

// let countMartin = 0
// let countDijkstra = 0
// let countChan = 0

// blogs.forEach(blog => {
//   if (blog.author === 'Robert C. Martin') return countMartin++
//   else if (blog.author === 'Edsger W. Dijkstra') return countDijkstra++
//   else if (blog.author === 'Michael Chan') return countChan++
// })

// let object

// if ( (countMartin > countDijkstra) && (countMartin > countChan ) ) { // if martin has the largest amount of blogs    //   object = {
//     author: 'Robert C. Martin',
//     blogs: countMartin
//   }
// } else if ( (countDijkstra > countMartin) && (countDijkstra > countChan) ) { // if dijstra has the largest amount of blogs
//   object = {
//     author: 'Edsger W. Dijkstra',
//     blogs: countDijkstra
//   }
// } else { // if chan ...
//   object = {
//     author: 'Michael Chan',
//     blogs: countChan
//   }
// }


module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }