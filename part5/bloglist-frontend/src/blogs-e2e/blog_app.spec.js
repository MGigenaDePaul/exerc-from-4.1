import { test, describe, expect, beforeEach } from '@playwright/test'

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('Basquez')
    await page.getByLabel('username').fill('5225')
    await page.getByRole('button', { name: 'login' }).click()
  })
})

