const loginWith = async (page, username, password) => {
    await page.getByTestId('username').first().fill(username)
    await page.getByTestId('password').last().fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)

    await page.getByRole('button', {name: 'create'}).click()
}

const createBlogOtherUser = async (page, request) => {
    await request.post('/api/users', {
        data: {
          name: 'Shoei Ohtani',
          username: 'sohtani',
          password: 'salainen'
        }
      })
      await page.goto('/')

      await loginWith(page, 'sohtani', 'salainen')

      await createBlog(page,'ohtanin blogi', 'shoei ohtani', 'www.ohtani.com')
    }



export {loginWith, createBlog, createBlogOtherUser}