const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('wrong')

      await page.getByRole('button', { name: 'login' }).click()
      const errorLocation = page.locator('.error')
      await expect(errorLocation).toContainText('wrong credentials')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')

      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('title...')
      await page.getByTestId('author').fill('author...')
      await page.getByTestId('url').fill('url...')

      await page.getByRole('button', { name: 'post' }).click()

      const blogList = page.getByTestId('blogList')
      await expect(blogList).toContainText('show')
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('title...')
      await page.getByTestId('author').fill('author...')
      await page.getByTestId('url').fill('url...')

      await page.getByRole('button', { name: 'post' }).click()

      await page.getByRole('button', { name: 'show' }).click()
      await expect(page.getByText('likes: 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes: 1')).toBeVisible()
      await expect(page.getByText('likes: 0')).not.toBeVisible()
    })

    test('a blog can be removed', async ({ page }) => {
      const blogList = page.getByTestId('blogList')

      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('title...')
      await page.getByTestId('author').fill('author...')
      await page.getByTestId('url').fill('url...')

      await page.getByRole('button', { name: 'post' }).click()
      
      await page.getByRole('button', { name: 'show' }).click()
      await expect(blogList).toContainText('title...')

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(blogList).not.toContainText('title...')
    })

    test('only the creator can see the remove button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Another User',
          username: 'anotherUser',
          password: 'salainen2'
        }
      })

      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('title...')
      await page.getByTestId('author').fill('author...')
      await page.getByTestId('url').fill('url...')

      await page.getByRole('button', { name: 'post' }).click()

      await page.getByRole('button', { name: 'show' }).click()

      await expect(page.getByText('remove')).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByTestId('username').fill('anotherUser')
      await page.getByTestId('password').fill('salainen2')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Another User logged in')).toBeVisible()

      await page.getByRole('button', { name: 'show' }).click()

      await expect(page.getByText('remove')).not.toBeVisible()
    })

    test('blogs are arranged according to the number of likes', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('title 1...')
      await page.getByTestId('author').fill('author 1...')
      await page.getByTestId('url').fill('url 1...')

      await page.getByRole('button', { name: 'post' }).click()

      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('title 2...')
      await page.getByTestId('author').fill('author 2...')
      await page.getByTestId('url').fill('url 2...')

      await page.getByRole('button', { name: 'post' }).click()

      const blogList = page.getByTestId('blogList')
      await expect(blogList).toContainText('title 1...')
      await expect(blogList).toContainText('title 2...')

      await page.getByRole('button', { name: 'show' }).first().click()
      await page.getByRole('button', { name: 'show' }).last().click()

      await expect(page.getByText('url 2...likes: 0')).toBeVisible()
      await expect(page.getByText('url 1...likes: 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).last().click()
      
      await expect(page.getByText('url 2...likes: 1')).toBeVisible()
      await expect(page.getByText('url 1...likes: 0')).toBeVisible()

      await page.getByRole('button', { name: 'hide' }).first().click()

      await expect(page.getByText('url 2...likes: 1')).not.toBeVisible()
      await expect(page.getByText('url 1...likes: 0')).toBeVisible()
    })
  })
})