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
        await expect(page.locator('.blog').getByText('created blog Playwright')).toBeVisible()
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
        await expect(page.locator('.blog').getByText('blog to delete Playwright')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()

        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        
        await expect(page.locator('.blog').getByText('blog to delete Playwright')).not.toBeVisible()
    })
  })
})
