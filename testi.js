const blogs = [
  {
    'url': 'https://wwaki-hintsa-voittamisen-anatomia?variant=21150604886105&gad_source=1&gclid=CjwKCAjw2dG1BhB4EiwA998cqHLLXVprkYJ5Q_4NKEq9WZnBJ6BVvbt5BONPbtGjZOORqkBhpTEIQBoCelQQAvD_BwE',
    'title': 'testi userExtraction',
    'author': 'skrrrrt',
    'user': {
      'username': 'testi',
      'name': 'testi',
      'id': '66bf33604ec46b5eb0ddf6ef'
    },
    'likes': 23,
    'id': '66bf78092e838da887447c70'
  },
  {
    'title': 'Urheilucast',
    'author': 'Esko Seppänen',
    'url': 'www.urheilujatka.fi',
    'likes': 5,
    'user': {
      'username': 'testi',
      'name': 'testi',
      'id': '66bf33604ec46b5eb0ddf6ef'
    },
    'id': '66c860233f0549e3cb9d8879'
  },
  {
    'title': 'Kokkialees',
    'author': 'Kape Aihinen',
    'url': 'djdjdjdjdjkdjdd',
    'likes': 16,
    'user': {
      'username': 'testi',
      'name': 'testi',
      'id': '66bf33604ec46b5eb0ddf6ef'
    },
    'id': '66c8792d3f0549e3cb9d8934'
  },
  {
    'title': 'kokki',
    'author': 'tanelle',
    'url': 'tänään',
    'likes': 10,
    'user': {
      'username': 'testi',
      'name': 'testi',
      'id': '66bf33604ec46b5eb0ddf6ef'
    },
    'id': '66c8b39ca4debce89453c337'
  }
]

const blogsInLikeOrder = (blogs) => {
  const blogsInOrder = blogs.sort((a,b) => b.likes - a.likes)
  return blogsInOrder
}

const tulos = blogsInLikeOrder(blogs)
console.log('tulos', tulos)