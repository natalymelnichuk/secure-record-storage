# Notes API (Node.js & MongoDB)

A RESTful API built with Node.js, Express, and MongoDB that implements user authentication and strict ownership-based access control for managing personal notes.


## Features

- **User Authentication:** Registration and login functionality using JWT (JSON Web Tokens) and password hashing with `bcrypt`.
- **User-Note Association:** Each note is automatically linked to its creator via MongoDB `ObjectId` references (`ref: 'User'`).
- **Data Isolation:** Users can only fetch and view their own created notes (`GET /api/notes`).
- **Ownership Protection:** Strict authorization checks on single-resource operations (`GET /:id`, `PUT /:id`, `DELETE /:id`). Attempts by unauthorized users return a `403 Forbidden` status code.


## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose ORM
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **API Testing:** Postman


## API Endpoints

### User Routes (`/api/users`)

| `POST` | `/api/users/register` | Register a new user account
| `POST` | `/api/users/login` | Authenticate user & return JWT token

### Note Routes (`/api/notes`)

| `GET` | `/api/notes` | Get all notes created by the logged-in user
| `POST` | `/api/notes` | Create a new note attached to the logged-in user
| `GET` | `/api/notes/:id` | Get a specific note by ID *(Owner only)*
| `PUT` | `/api/notes/:id` | Update a specific note by ID *(Owner only)*
| `DELETE` | `/api/notes/:id` | Delete a specific note by ID *(Owner only)*


## Security & Authorization Logic

When a user attempts to retrieve, update, or delete a note by ID, the API performs a two-step validation:

1. **Existence Check:** Verifies if the note exists in the database. Returns `404 Not Found` if missing.
2. **Ownership Check:** Compares `note.user` with `req.user._id`:
   ```javascript
   if (note.user.toString() !== req.user._id.toString()) {
     return res.status(403).json({ message: "You are not authorized to perform this action!" });
   }
   ```


## Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance running locally or via MongoDB Atlas

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/natalymelnichuk/secure-record-storage
   cd secure-record-storage
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database_name>?appName=Cluster0

   JWT_SECRET=your_jwt_secret_key
   ```

**Note:** Replace <username>, <password>, and <database_name> with your actual MongoDB Atlas connection details.

4. **Start the server:**
   ```bash
   npm start
   ```