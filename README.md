# Nemesis DB

A simple Node.js web application for user management with authentication. Built for an interview technical assessment.

---
**Note:**

This application is production-ready: beautify UI and clickable links. The pages are responsive on smaller devices.


## What it is

This is a basic user management system where people can register, login, and access a dashboard. I built it using HTMX instead of React because I wanted to show what I can actually do rather than copy-paste code I don't understand. HTMX gives you that smooth single-page feel without the complexity.

The app follows a standard MVC pattern - nothing fancy, just organized and clean.

## Tech Stack

**Backend:**
- Express.js for the web server
- PostgreSQL for the database
- EJS for templates
- bcrypt for password hashing
- JWT for authentication
- Joi for input validation

**Frontend:**
- HTMX for dynamic content
- Bootstrap for styling

**Development:**
- nodemon for development

## Getting Started

You'll need Node.js and PostgreSQL installed.

1. **Install dependencies**
```bash
npm install
```

2. **Set up your database**
Create a PostgreSQL database called `nemesis_db`, then you have two options:

- **Option A**: Run the SQL statements below to create the tables - users & login_history
- **Option B**: Use `pg_restore` to import the database dump file in the root folder

---

3. **Environment setup**
Create a `.env` file:
```env
PORT=3000
JWT_SECRET=your_secret_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nemesis_db
DB_USER=your_username
DB_PASSWORD=your_password
```

4. **Run it**
```bash
npm run dev
```

Visit `http://localhost:3000` and you should see the homepage.

## Database Tables

**users table:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**login_history table:**
```sql
CREATE TABLE login_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    login_successful BOOLEAN NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_method VARCHAR(50) DEFAULT 'email_password',
    failure_reason VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## How it works

- Users can register with email and password
- Passwords are hashed with bcrypt
- JWT tokens are stored in HTTP-only cookies
- Protected routes check for valid tokens
- Login attempts are tracked for basic security
- HTMX handles the dynamic page updates

The dashboard is pretty basic - just shows user info and some placeholder stats. The focus was on getting the authentication flow right.

## Improvements

If I had more time, here are some things I'd improve:

1. **Frontend validation with Joi** - Since we're already using Joi for backend validation, there's no reason to do vanilla JavaScript validation on the frontend. We could use the same Joi schemas on both sides for consistency.

2. **Better MVC separation** - This follows MVC pattern but the controllers are doing database queries directly. In a proper MVC setup, those queries should be moved to model files to keep the controllers clean and focused on handling requests/responses.

## A note on React

The original requirements mentioned React and Redux, but I chose HTMX instead. I don't have React experience and don't want to submit something I can't explain or maintain. 
HTMX achieves similar user experience goals with technology I actually understand.


