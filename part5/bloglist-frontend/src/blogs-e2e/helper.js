import {expect} from '@playwright/test'

const loginWith = async (page, username, password) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByRole('textbox', { name: 'write title' }).fill(title)
  await page.getByRole('textbox', { name: 'write author' }).fill(author)
  await page.getByRole('textbox', { name: 'write url' }).fill(url)
  await page.getByRole('button', { name: 'create' }).click()

  await expect(page.locator('.blog').filter({ hasText: `${title} ${author}` })).toBeVisible()
  await page.reload()
}

export { loginWith, createBlog }