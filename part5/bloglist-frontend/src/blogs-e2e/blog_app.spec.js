import { test, describe, expect, beforeEach } from '@playwright/test'
import { loginWith } from './helper'

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
    await loginWith(page, 'Basquez', '5225')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'Basquez', '5225')
        await expect(page.getByText('Julio logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'Raul', '59083')

        const errorDiv = page.locator('.message.error')
        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Julio logged in')).not.toBeVisible()
    })
  })
})
