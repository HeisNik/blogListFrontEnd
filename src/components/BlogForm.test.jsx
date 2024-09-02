import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { expect } from 'vitest'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    const {container} = render(<BlogForm createBlog={createBlog}/>)

    const titleInput = container.querySelector('#titleInput')
    const authorInput = container.querySelector('#authorInput')
    const urlInput = container.querySelector('#urlInput')
    const createButton = container.querySelector('#createButton')

    await user.type(titleInput, 'testaajan react testit')
    await user.type(authorInput, 'testaaja')
    await user.type(urlInput, 'www.testi.fi')
    await user.click(createButton)   

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testaajan react testit')
    expect(createBlog.mock.calls[0][0].author).toBe('testaaja')
    expect(createBlog.mock.calls[0][0].url).toBe('www.testi.fi')
  })