# Anime eCommerce Site

# Anime eCommerce

A full-stack e-commerce web application built around an anime-themed storefront. The application allows users to browse products, create an account, log in, and manage their shopping cart. User and cart data are stored in a MySQL database through a Node.js and Express backend.

## Features

* User registration and login
* Password hashing using bcrypt
* Anime-themed storefront
* Product browsing
* Shopping cart functionality
* Persistent cart data using MySQL
* Session-based user authentication
* REST API endpoints for application data
* Responsive and animated frontend

## Tech Stack

**Frontend**

* HTML5
* CSS3
* JavaScript

**Backend**

* Node.js
* Express.js

**Database**

* MySQL

**Libraries**

* bcrypt
* express-session
* mysql2
* cors
* dotenv
* body-parser

## Project Structure

```text
anime-ecommerce/
│
├── backend/
│   ├── db/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── database/
│
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── cart.html
│   ├── home.html
│   ├── index.html
│   └── products.html
│
├── .env.example
├── .gitignore
└── README.md
```

## Application Flow

```text
User
  │
  ▼
Frontend
  │
  ▼
Node.js + Express
  │
  ▼
MySQL Database
```

The frontend communicates with the Express backend through HTTP requests. The backend handles authentication and cart operations and communicates with MySQL for persistent data storage.

## API Endpoints

| Method | Endpoint       | Purpose                         |
| ------ | -------------- | ------------------------------- |
| POST   | `/register`    | Register a new user             |
| POST   | `/login`       | Authenticate a user             |
| POST   | `/add-to-cart` | Save cart items to the database |

## Database

MySQL is used to store application data including user and cart information.

Database configuration is provided through environment variables rather than being stored directly in the source code.

## Getting Started

### Prerequisites

* Node.js
* MySQL
* Git

### Installation

Clone the repository:

```bash
git clone https://github.com/abhishekkatti17/anime-ecommerce.git
cd anime-ecommerce
```

Install backend dependencies:

```bash
cd backend
npm install
```

### Environment Configuration

Create a `.env` file inside the `backend` directory using `.env.example` as a reference.

Configure your MySQL connection details:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
```

### Database Setup

Create the required MySQL database and tables using the SQL files provided in the `database` directory.

### Run the Backend

```bash
node server.js
```

The backend runs locally on:

```text
http://localhost:3000
```

Open the frontend through a local development server and access the application from the frontend entry page.

## Screenshots

## Screenshots

- [Home Page](frontend/assets/screenshots/home.png) — Main anime-themed storefront.
- [Authentication](frontend/assets/screenshots/login.png) — User registration and login.
- [Products](frontend/assets/screenshots/products.png) — Browse available merchandise.
- [Shopping Cart](frontend/assets/screenshots/cart.png) — Review and manage selected products.

## Future Improvements

* Product search and filtering
* Order management
* Payment integration
* Improved authentication and authorization
* Admin product management
* Production deployment

## Author

**Abhishek**

GitHub: [abhishekkatti17](https://github.com/abhishekkatti17)
