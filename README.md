# 🍽️ SEA Catering REST API

A RESTful API built with Node.js and MySQL to manage user subscriptions, testimonials, and authentication for a healthy catering service. This project was designed for the challenge of Software Engineering Academy by COMPFEST 17 University of Indonesia

---

## 🚀 Features

- 🔐 User registration and login with hashed password
- 🎫 JWT authentication & role-based authorization (`admin` / `user`)
- 📝 Subscription creation with auto price calculation
- ⭐ User-generated testimonials linked to authenticate user
- 🔒 Protected routes using middleware
- 📦 Built with Express.js, MySQL2, and modern JavaScript (ESM)

---

## 🧱 Tech Stack

- **Backend**: Node.js + Express (ES Modules)
- **Database**: MySQL
- **Authentication**: JWT
- **Password Security**: bcrypt
- **Environment Config**: dotenv

---

## 📂 Folder Structure
```
src/
├── app.js
├── config/
│ └── database.js
├── controllers/
├── middlewares/
├── routes/
│ └── v1/
└── .env
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yasersyafa/sea-backend.git
cd sea-backend
```
### 2. Install Dependencies
``` bash
npm install
```
### 3. Setup Environment file
``` bash
cp .env.example .env
```
#### note: make sure the database configuration same as well your computer

### 4. Create the Database
- Make sure MySQL is running (e.g., via XAMPP).
- Create database (name of database: sea_catering_api)

### 5. Run the Project
``` bash
npm run dev
```
