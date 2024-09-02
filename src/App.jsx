import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ notification }) => {

  if (!notification.message) {
    return
  }

  const style = {
    color: notification.type==='error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={style}>
      {notification.message}
    </div>
  )

}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null })
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notifyWith('wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added!`)
      })
      .catch(error => {
        console.log('error', error.response.data.error)
        notifyWith('title or url missing', 'error')
      })
  }

  const notifyWith = (message, type='info') => {
    setNotification({
      message, type
    })

    setTimeout(() => {
      setNotification({ message: null } )
    }, 3000)
  }

  const handleBlogLikes = (updatedBlog) => {
    blogService
      .update(updatedBlog.id, updatedBlog)
      .then(returnedBlog => {
        returnedBlog.user = updatedBlog.user
        setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : returnedBlog))
      })
  }

  const blogsInLikeOrder = (blogs) => {
    const blogsInOrder = blogs.sort((a,b) => b.likes - a.likes)
    return blogsInOrder
  }

  const deleteBlog = (id, title) => {
    //console.log('id', id)
    if (window.confirm(`remove blog ${title}`)) {
      blogService
        .remove(id)
        .then(response => {
          setBlogs(blogs.filter(blog => blog.id !== id))
          notifyWith(`You deleted blog ${title}`)
        })
    }
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification}/>
        <form onSubmit={handleLogin}>
          <div>
          username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification}/>
      <p>{user.name} logged in <button onClick={() => handleLogout()}>Log out</button></p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {blogsInLikeOrder(blogs).map(blog =>
        <Blog key={blog.id} blog={blog} handleBlogLikes={handleBlogLikes} user={user} deleteBlog={deleteBlog}/>
      )}
    </div>
  )
}

export default App