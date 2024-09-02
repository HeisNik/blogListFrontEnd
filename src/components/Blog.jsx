import { useState } from 'react'
import blogs from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleBlogLikes, user, deleteBlog }) => {
  const [blogOpen, setBlogOpen] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const openBlog = () => {
    setBlogOpen(!blogOpen)
  }

  const handleLikes = (blog) => {
    const updatedLikes = blog.likes + 1
    handleBlogLikes({ ...blog, likes: updatedLikes })
  }

  const deleteButton = (username) => {
    if (username === user.username) {
      return <button onClick={() => deleteBlog(blog.id, blog.title)}>remove</button>
    }
  }

  /*const handleBlogLikes = (id) => {
    const blog = blogs.find(blog => blog.id === id)
    console.log('blog', blog)
  }
*/
  if (blogOpen === false ) {
    return (
      <div style={blogStyle} className='closedBlog'>
        <b>{blog.title}</b> {blog.author} <button id='openBlogButton' onClick={openBlog}>view</button>
      </div>
    )}

  return (
    <div style={blogStyle}>
      <div className='titleAndAuthor'><b>{blog.title}</b> {blog.author} <button onClick={openBlog}>hide</button></div>
      <div className='url'>{blog.url}</div>
      <div className='likes'>likes {blog.likes} <button onClick={() => handleLikes(blog)} id='likeButton'>like</button></div>
      <div className='blogUser'>{blog.user.username}</div>
      {deleteButton(blog.user.username)}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleBlogLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog