# Bookstore

- Shahan Ahmad

Back-end Node.js + simple frontend for a Bookstore CRUD application

---

## Project Summary

This project is a small MERN-style backend for managing a bookstore with a lightweight frontend. It implements a RESTful API (Express + Mongoose) to create, read, update, and delete books. The project includes a classic single-page frontend served from the server, plus an animated landing page.

## Features

- REST API using Express and Mongoose
- Full CRUD for books (Create, Read, Update, Delete)
- Classic single-page frontend served at `/` that interacts with the API
- Animated landing page at `/landing/` for demo/visual polish

## Files of interest

- `index.js` — application entry and static-serving configuration
- `Routes/bookRoutes.js` — API route definitions (mounted at `/api/books`)
- `controller/bookController.js` — request handlers for books
- `modles/BookModles.js` — Mongoose schema and model for Book (note: folder name has a typo — `modles`)
- `public/` — static front-end assets (`/` classic UI and `landing/` animated landing)
- `middleware/errorHandler.js` — error handler

## Prerequisites

- Node.js (v14+ recommended)
- npm (or yarn)
- A running MongoDB instance (local or remote). If you do not have MongoDB installed locally, you can use a cloud MongoDB URI (Atlas).

## Setup & Run

1. Install dependencies:

```bash
npm install
```

2. (Optional) Create a `.env` file to set your MongoDB URI and PORT:

```
MONGODB_URI=mongodb://localhost:27017/bookstore
PORT=3000
```

3. Start the server:

```bash
node index.js
```

4. Open the application in a browser:

- Classic frontend (full CRUD): http://localhost:3000/
- Animated landing (visual demo): http://localhost:3000/landing/

## API Documentation

Base URL: `http://localhost:3000/api/books`

Available endpoints:

- GET `/allBooks` — Retrieve all books
- GET `/:id` — Retrieve a single book by id
- POST `/add` — Create a new book
  - Example JSON body:
    ```json
    {
      "title": "Example Book",
      "author": "Author Name",
      "publicationYear": 2020,
      "genre": "Fiction"
    }
    ```
  - Note: the backend accepts `publicationYear` and (legacy) `publishedYear`. The frontend sends both for compatibility.
- PUT `/edit/:id` — Update an existing book
- DELETE `/:id` — Delete a book by id

Example curl to create a book:

```bash
curl -X POST http://localhost:3000/api/books/add \
  -H "Content-Type: application/json" \
  -d '{"title":"Example Book","author":"Author Name","publicationYear":2020,"genre":"Fiction"}'
```

## Frontend

The classic frontend (root) supports:

- List all books
- Add a new book
- Edit a book
- Delete a book

The frontend uses the API endpoints above.

## Known Issues & Recommendations

- Folder name typo: The model is in `modles/BookModles.js`. Consider renaming to `models/BookModel.js` and updating imports.
- Field name inconsistency: code uses `publicationYear` and sometimes `publishedYear`. Standardize on `publicationYear` for clarity.
- Add authentication, input sanitization, and stronger validation for production use.

## Contributing

If you'd like to contribute:

- Open an issue to propose changes
- Send a pull request with a clear description of what you changed



Made by: **Shahan Ahmad**

