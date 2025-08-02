const dummy = (blogs) => {
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

module.exports = { dummy, totalLikes, favoriteBlog }