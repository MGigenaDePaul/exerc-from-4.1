import { test, describe, expect, beforeEach } from '@playwright/test'
import { loginWith, createBlog } from './helper'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Julio',
        username: 'Basquez',
        password: '5225'
      }
    })

    await request.post('/api/users', {
      data: {
        name: 'Dylan',
        username: 'Contreras', 
        password: '4444'
      }
    })


    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await loginWith(page, 'Lopez', '4224')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'Basquez', '5225')
        await expect(page.getByText('Julio logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'Basquez', 'wrong')

        const errorDiv = page.locator('.message.error')
        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Julio logged in')).not.toBeVisible()
    })
  }) 

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'Basquez', '5225')
    })

    test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'created blog', 'Playwright', 'https://inventedUrl.com')
    })

    test('a blog can be liked', async({ page }) => {
        await createBlog(page, 'Love and Lemons', 'Ramirez', 'https://www.loveandlemons.com/' )
        await expect(page.locator('.blog').getByText('Love and Lemons Ramirez')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user who adds a blog can remove it', async({ page }) => {
        await createBlog(page, 'blog to delete', 'Playwright', 'https://blogToDelete.com')

        // scope to the exact blog 
        const blog = page.locator('.blog').filter({ hasText: 'blog to delete Playwright'})
        await expect(blog).toBeVisible()
        
        // open the blog, check if remove button of that exact blog is seen
        await blog.getByRole('button', { name: 'view' }).click()
        const removeButton = blog.getByTestId('rmv-button')
        await expect(removeButton).toBeVisible()

        // handle window.confirm() before clicking
        page.on('dialog', dialog => dialog.accept())
        await removeButton.click()
        
        await expect(page.locator('.blog').getByText('blog to delete Playwright')).not.toBeVisible()
    })

    test('only the user who adds the blog can see the remove button', async({ page }) => {
        // Basquez can see the remove button
        createBlog(page, 'How to Create an Unforgettable Training Session in 8 Simple Steps', 'Deborah', 'https://www.sessionlab.com/blog/training-session-plan/')
        
        // go to the exact created blog
        const blog = page.locator('.blog').filter({ hasText: 'How to Create an Unforgettable Training Session in 8 Simple Steps' })
        await expect(blog).toBeVisible()

        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByTestId('rmv-button')).toBeVisible()
        await page.getByRole('button', { name: 'logout' }).click()

        // another user must not see the remove button
        await loginWith(page, 'Contreras', '4444')
        await expect(page.getByText('Dylan logged in')).toBeVisible()
        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByTestId('rmv-button')).not.toBeVisible()
    })
  })
})
