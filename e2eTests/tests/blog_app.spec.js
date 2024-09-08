const { test, expect, beforeEach, describe } = require('@playwright/test')
const {loginWith, createBlog, createBlogOtherUser} = require('./helper')
const { title } = require('process')


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.getByTestId('loginForm')
    await expect(loginForm).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'väärä', 'vääräsalis')
        await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
          await loginWith(page, 'mluukkai', 'salainen')
        })
      
        test('a new blog can be created', async ({ page }) => {
          await createBlog(page, 'testblog', 'tester', 'www.test.com')
          await expect(page.getByText('a new blog testblog by tester added!')).toBeVisible()
          await expect(page.getByText('testblog tester view')).toBeVisible()
        })
    describe('and a blog exists', () => {
        beforeEach(async ({page}) => {
          await createBlog(page, 'testblog', 'tester', 'www.test.com')
        })
        test('blog can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          const blogElement = await page.getByTestId('openBlog')

          await blogElement
          .getByRole('button', {name: 'like'}).click()
          await expect(blogElement.getByText('likes 1')).toBeVisible()
        })
        test('blog can be deleted', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()

          page.on('dialog', dialog => dialog.accept())
          await page.getByRole('button', {name: 'remove'}).click()

          await expect(page.getByText('You deleted blog testblog')).toBeVisible()
          await expect(page.getByTestId('closedBlog')).toBeHidden()
          await expect(page.getByTestId('openBlog')).toBeHidden()
        })
        test('only user that created the blog can see the delete button', async ({ page, request }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', {name: 'remove'})).toBeVisible()
          await page.getByRole('button', {name: 'Log out'}).click()

          await request.post('/api/users', {
          data: {
          name: 'Donald Trump',
          username: 'dtrump',
          password: 'salainen'
          }
        })

          await page.goto('/')

          await loginWith(page, 'dtrump', 'salainen')
          await expect(page.getByText('Donald Trump logged in')).toBeVisible()
          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', {name: 'remove'})).toBeHidden()
        })
        })
        describe('When there is three blogs', () => {
          beforeEach(async ({ page }) => {
            await createBlog(page, 'testblog', 'tester', 'www.test.com')
            await page.getByText('a new blog testblog by tester added!').waitFor()
            await createBlog(page, 'testblog2', 'tester2', 'www.test2.com')
            await page.getByText('a new blog testblog2 by tester2 added!').waitFor()
            await createBlog(page, 'testblog3', 'tester3', 'www.test3.com')
            await page.getByText('a new blog testblog3 by tester3 added!').waitFor()
          })
        
          test('blogs are in order of the likes', async ({ page }) => {
            await page.getByText('testblog tester').getByRole('button', { name: 'view' }).click()
            await page.getByText('testblog2 tester2').getByRole('button', { name: 'view' }).click()
            await page.getByText('testblog3 tester3').getByRole('button', { name: 'view' }).click()

            const blogs = await page.getByTestId('openBlog').all()

            /*for (const blog of blogs) {
              const titleAndAuthor = await blog.getByTestId('titleAndAuthor').textContent()
              console.log('blog title and author', titleAndAuthor)
            }*/
            
            await blogs[2].getByRole('button', { name: 'like' }).click()
            await page.waitForTimeout(1000)
            await blogs[0].getByRole('button', { name: 'like' }).click()
            await page.waitForTimeout(1000)
            await blogs[2].getByRole('button', { name: 'like' }).click()
            await page.waitForTimeout(1000)

            const blogsAfterLikes = await page.getByTestId('openBlog').all()

            /*for (const blog of blogsAfterLikes) {
              const titleAndAuthor = await blog.getByTestId('titleAndAuthor').textContent()
              console.log('blog title and author after likes', titleAndAuthor)
            }*/
            
            const blogTitles = await Promise.all(blogsAfterLikes.map(blog => blog.getByTestId('titleAndAuthor').textContent()))
            
            expect(blogTitles[0]).toBe('testblog3 tester3 hide')
            expect(blogTitles[1]).toBe('testblog2 tester2 hide')
            expect(blogTitles[2]).toBe('testblog tester hide')
          })
        })
      })
    
})