# Moloc – Collaborative Platform

University project – client-server web platform for collaborative model analysis, document versioning and automatic validation.

---

## 🚀 Overview

Moloc is a web-based platform developed to support the creation, validation, and collaborative management of structured models.
The system replaces a legacy desktop tool with a modern client-server architecture, enabling multiple users to interact with shared resources through a browser.

---

## ✨ Features

* 🔐 User authentication and role-based access control (admin / user)
* 🤝 Collaborative document and model management
* 📝 Document editing and visualization
* 🕒 Versioning system for documents and models
* ✅ Automatic validation of structured models
* 🌐 Web interface accessible via browser
* ⚙️ Migration from legacy standalone application

---

## 🏗️ Architecture

The application follows a classic MVC structure:

* **Backend:** Node.js + Express
* **Database:** MongoDB (via Mongoose)
* **Frontend:** EJS templates + JavaScript
* **Structure:**

  * `controllers/` → application logic
  * `models/` → database schemas
  * `routes/` → routing layer
  * `views/` → UI templates
  * `public/` → static assets

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* EJS
* JavaScript (frontend)
* CSS

---

## 📁 Project Structure

```text
.
├── app.js                          # Main application entry (Express setup)
├── package.json                    # Dependencies and scripts
├── package-lock.json               # Dependency lock file
│
├── bin/
│   └── www                         # Server startup script
│
├── config/
│   └── winston.js                  # Logging configuration
│
├── controllers/                    # Application logic (MVC controllers)
│   ├── admin_controller.js
│   ├── user_controller.js
│   ├── log_controller.js
│   └── modifica_valida_modello_controller.js
│
├── models/                         # Database schemas (Mongoose)
│   ├── utenti.js
│   ├── modelli.js
│   ├── documenti.js
│   └── corso.js
│
├── routes/                         # Express routes
│   ├── index.js
│   ├── profilo_admin.js
│   └── profilo_utente.js
│
├── views/                          # EJS templates (frontend UI)
│   ├── login.ejs
│   ├── profilo_admin_*.ejs
│   ├── profilo_utente.ejs
│   ├── modifica_*.ejs
│   ├── valida_modello.ejs
│   ├── visualizza_documento.ejs
│   └── error/404 views
│
├── public/                         # Static assets (frontend)
│   ├── javascripts/
│   │   ├── moloc.js
│   │   └── moloc_script/
│   │       ├── phaseZero/          # Core logic and rules
│   │       ├── phaseOne/           # Model creation & parsing
│   │       ├── phaseTwo/           # Traces and execution
│   │       ├── phaseThree/         # Output & validation
│   │       └── phaseFour/          # Analysis & visualization
│   │
│   ├── stylesheets/
│   └── images/
│
└── .env.example                   # Example environment configuration

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/SimonePisani/moloc-collaborative-platform.git
cd moloc-collaborative-platform
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create a `.env` file based on `.env.example`:

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
PORT=8080
```

---

### 4. Run the application

```bash
npm start
```

The server will start on:

```
http://localhost:8080
```

---

## 🔐 Authentication

The system supports:

* User registration
* Login system
* Role-based permissions (admin / standard user)

---

## 📌 Notes

* This project was developed as part of a university thesis.
* It has been tested in a real academic environment.
* Some configurations (e.g. database credentials) are intentionally excluded for security reasons.

---

## 📷 Screenshots

<img width="1868" height="572" alt="Moloc" src="https://github.com/user-attachments/assets/43e2ab1d-d004-4a65-b694-723a1792e3b8" />

---

<img width="1858" height="941" alt="Moloc2" src="https://github.com/user-attachments/assets/595b530c-27f5-423f-be82-a4b46bc9de6b" />

---

<img width="1856" height="944" alt="Screenshot 2026-05-04 124924" src="https://github.com/user-attachments/assets/6faed281-80e5-4519-9f50-f9a7ffb2ccb4" />

---

<img width="1858" height="914" alt="Moloc4" src="https://github.com/user-attachments/assets/60cfc19d-57d1-4209-a33b-2222734bf44d" />

---

## 🚧 Future Improvements

* UI/UX modernization
* REST API refactoring
* Deployment (Docker / cloud)
* Improved validation engine

---

## 👨‍💻 Author

Simone Pisani

---

## 📄 License

This project is for educational purposes.
