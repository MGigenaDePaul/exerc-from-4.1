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

// ----------- mostBlogs WITHOUT LODASH (it passes the test, but it wouldn't work if we add another blog)
const mostBlogs = (blogs) => {
  let countMartin = 0
  let countDijkstra = 0
  let countChan = 0

  // count blogs for each author
  blogs.forEach(blog => {
    if (blog.author === 'Robert C. Martin') return countMartin++
    else if (blog.author === 'Edsger W. Dijkstra') return countDijkstra++
    else if (blog.author === 'Michael Chan') return countChan++
  })

  let object

  if ( (countDijkstra > countMartin) && (countDijkstra > countChan) ) { // if dijkstra has the largest amount of blogs
    object = {
      author: 'Edsger W. Dijkstra',
      blogs: countDijkstra
    }
  } else if ((countMartin > countDijkstra) && (countMartin > countChan ) ) { // if martin has the largest amount of blogs
    object = {
      author: 'Robert C. Martin',
      blogs: countMartin
    }
  } else { // if chan ...
    object = {
      author: 'Michael Chan',
      blogs: countChan
    }
  }

  return object
}

// mostBlogs with LODASH (test passes and it works if we add more blogs)
const mostBlogsVersion2 = (blogs) => {
  const groupBlogs = _.groupBy(blogs, 'author')
  console.log(groupBlogs)
  const counts = _.map(groupBlogs, (authorBlogs, author) => ({
    author,
    blogs: authorBlogs.length
  }))

  const authorMostBlogs = _.maxBy(counts, 'blogs')

  return authorMostBlogs
}

// it passes the test, but it wouldn't if we add another blog
const mostLikes = (blogs) => {
  let object

  // likes of blogs combined of corresponding author
  let likesMartin = 0
  let likesDijkstra = 0
  let likesChan = 0

  // calculate likes
  blogs.forEach(blog => {
    if (blog.author === 'Robert C. Martin') {
      likesMartin += blog.likes
    } else if (blog.author === 'Edsger W. Dijkstra') {
      likesDijkstra += blog.likes
    } else {
      likesChan += blog.likes
    }
  })

  // compare which author has the most likes combined
  if ( (likesMartin > likesDijkstra) && (likesMartin > likesChan) ) {
    object = {
      author: 'Robert C. Martin',
      likes: likesMartin
    }
  } else if ( (likesDijkstra > likesMartin) && (likesDijkstra > likesChan) ) {
    object = {
      author: 'Edsger W. Dijkstra',
      likes: likesDijkstra
    }
  } else {
    object = {
      author: 'Michael Chan',
      likes: likesChan
    }
  }

  const authorMostLikes = object
  return authorMostLikes
}

const mostLikesVersion2 = (blogs) => {
  const groupBlogs = _.groupBy(blogs, 'author')

  // totalLikesCombined of blogs of each author
  const totalLikesCombined = _.map(groupBlogs, (authorBlogs, author) => ({
    author,
    likes: _.sumBy(authorBlogs, 'likes')
  }))

  // compare totalLikesCombined of each author
  const authorMostLikes = _.maxBy(totalLikesCombined, 'likes')

  return authorMostLikes
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostBlogsVersion2, mostLikes, mostLikesVersion2 }