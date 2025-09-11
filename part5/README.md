# Bloglist App — Part 5

## ⚡ Quick Start

```bash
Install the dependencies before running the app or tests:

```bash
cd bloglist-frontend
npm install

cd bloglist-frontend/src
npm install

# 1. Start frontend
cd bloglist-frontend
npm run dev # port=5173

# 2. Start backend (test database)
cd ../bloglist-backend
npm run start:test # port=3003

# 3. Run Playwright tests (Chromium)
cd ../bloglist-frontend/src
npm test -- --project=chromium

# To run the Playwright test UI
cd ../bloglist-frontend/src
npm run test:ui



