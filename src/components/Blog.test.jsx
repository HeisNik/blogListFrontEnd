import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author', () => {
    const blog = {
      title: 'testaajan react testaukset',
      author: 'testaaja',
      url: 'www.testi.fi',
      likes: 5,
      user: {
            username: 'testikayttaja'
            }
    }
  
    const { container } = render(<Blog blog={blog} />)
  
    const titleElement = container.querySelector('.closedBlog')
    expect(titleElement).toHaveTextContent(
    'testaajan react testaukset'
  )

    const authorElement = container.querySelector('.closedBlog')
    expect(authorElement).toHaveTextContent(
    'testaaja'
  )

    const urlElement = container.querySelector('.url')
    expect(urlElement).toBeNull()

    const likesElement = container.querySelector('.likes')
    expect(likesElement).toBeNull()

  })

  test('clicking the button calls event handler once and renders url and likes too', async () => {
    const blog = {
      title: 'testaajan react testaukset',
      author: 'testaaja',
      url: 'www.testi.fi',
      likes: 5,
      user: {
        username: 'testikayttaja'
        }  
    }

    const testUser =  {
        username: 'testikayttaja',
    }

    const { container } = render(<Blog blog={blog} user={testUser}/>)
  
    const userForTest = userEvent.setup()
    const button = container.querySelector('#openBlogButton')
    await userForTest.click(button)
   
    const urlElement = container.querySelector('.url')
    const likesElement = container.querySelector('.likes')
    const userElement = container.querySelector('.blogUser')

    expect(urlElement).toHaveTextContent('www.testi.fi')
    expect(likesElement).toHaveTextContent('likes 5')
    expect(userElement).toHaveTextContent('testikayttaja')
  })

  test('clicking the button calls event handler once', async () => {
    const blog = {
      title: 'testaajan react testaukset',
      author: 'testaaja',
      url: 'www.testi.fi',
      likes: 5,
      user: {
        username: 'testikayttaja'
        }  
    }

    const testUser =  {
        username: 'testikayttaja',
    }
  
    const mockHandler = vi.fn()
  
    const { container } = render(
      <Blog blog={blog} user={testUser} handleBlogLikes={mockHandler}/>
    )
  
    const userForTest = userEvent.setup()

    const viewButton = container.querySelector('#openBlogButton')
    await userForTest.click(viewButton)

    const likeButton = container.querySelector('#likeButton')
    await userForTest.click(likeButton)
    await userForTest.click(likeButton)
  
    expect(mockHandler.mock.calls).toHaveLength(2)
  })