# 🛡️ Role-Based Authentication System (Node.js + Express + EJS)

🚀 **Live Demo:** [https://role-base-auth-bfwk.onrender.com](https://role-base-auth-bfwk.onrender.com)

---

## 📖 Overview

This project is a **Role-Based Authentication System** built with **Node.js, Express, EJS, and MongoDB**.
It provides **secure login, signup, and role-specific dashboard access** for users such as **Admin, Manager, and Employee**.
Authentication is handled using **JWT tokens** and stored securely in cookies.

---

## ✨ Features

✅ Secure user authentication with **JWT**
✅ Role-based route access (**Admin / Manager / Employee**)
✅ Password encryption using **bcrypt**
✅ Dynamic EJS templates for all pages
✅ Cookies for session management
✅ MongoDB integration for persistent user data
✅ Middleware-based route protection
✅ Fully deployed on **Render**

---

## ⚙️ Tech Stack

| Category       | Technologies Used                 |
| -------------- | --------------------------------- |
| Backend        | Node.js, Express.js               |
| Database       | MongoDB with Mongoose             |
| View Engine    | EJS                               |
| Authentication | JWT, bcrypt                       |
| Middleware     | cookie-parser, express.urlencoded |
| Deployment     | Render                            |

---

## 📁 Project Structure

```
📦 role-based-auth
├── configs/
│   ├── config.env
│   ├── database.js
├── controllers/
│   ├── auth.controller.js
│   ├── role.controller.js
├── middlewares/
│   ├── auth.middleware.js
├── models/
│   ├── user.model.js
├── routes/
│   ├── user.route.js
│   ├── admin.route.js
│   ├── manager.route.js
├── views/
│   ├── index.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│   ├── partials/
│   ├── pages/
├── public/
│   ├── css/
│   ├── js/
├── server.js
├── package.json
└── README.md
```

---

## 🔑 Role Access Levels

| Role         | Permissions                          |
| ------------ | ------------------------------------ |
| **Admin**    | Full control over users and managers |
| **Manager**  | Can manage employees                 |
| **Employee** | Limited access to personal dashboard |

---

## 🧠 Middleware Flow

The middleware checks for a valid JWT token in cookies before rendering protected routes.

```js
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
      req.user = decoded;
      res.locals.user = decoded;
    } catch (err) {
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
});
```

---

## ⚡ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/role-based-auth.git
cd role-based-auth
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create a `.env` File

```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
PRIVATE_KEY=your_jwt_secret
```

### 4️⃣ Run the App

```bash
npm start
```

Visit 👉 [http://localhost:3000](http://localhost:3000)

---

## 🧩 Example Routes

| Method | Route        | Description                   |
| ------ | ------------ | ----------------------------- |
| GET    | `/`          | Login Page                    |
| GET    | `/signup`    | Registration Page             |
| POST   | `/login`     | Login and JWT creation        |
| GET    | `/dashboard` | Protected route (Role-based)  |
| GET    | `/logout`    | Clears JWT token and logs out |

---

## 🧑‍💻 Author

**Rudra Gondaliya**
💼 Full Stack Developer | MERN Stack Enthusiast
🔗 [GitHub](https://github.com/yourusername)
📧 [rudragondaliya@example.com](mailto:rudragondaliya@example.com)

---

## 🪪 License

This project is licensed under the **MIT License** — free to use and modify.

---
