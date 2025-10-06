# Bloglist Application Extended

## Overview

The Bloglist app allows users to:
- Log in and log out
- View, create and like blog posts
- Add anonymous comments to blogs
- View all registered users and the blogs each user has created

## How to run the app
Go to the root of the project --> cd part7/bloglist-extend

Then go to the frontend and backend folder and install dependencies with "npm install"

To run the frontend and backend (OPEN 2 terminal bars)
````bash 
cd frontend
npm run dev

cd backend
npm run dev

````
## Features implemented

### Authentication
- Login with credentials (JWT).
- Persistent login using `localStorage`.
- Logout clears local storage and redirects to `/`.

### Blogs
- Display all blogs sorted by likes.
- Create and like blogs.
- Add **anonymous comments** under each blog.   

### Users
- View all registered users.
- View blogs created by each user.

### UI/UX
- Styled using **Material UI**



