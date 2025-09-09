const loginWith = async (page, username, password) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill(username)
    await page.getByLabel('username').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

export { loginWith }