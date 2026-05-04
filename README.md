# Moloc – Collaborative Platform for Model Analysis

A full-stack collaborative web platform designed to support the creation, validation and management of structured models in an academic environment.

Originally developed as part of a Bachelor’s thesis, the platform was **actively used until 2024** within a university course, supporting real users (students and instructors) in collaborative workflows.

---

## Overview

Moloc was designed to overcome limitations of a previous client-side tool by introducing a **scalable client-server architecture**, enabling:

* centralized model management
* real-time validation
* structured collaboration between students and instructors

The platform integrates editing, versioning and validation into a single environment.

---

## Problem

The original system (client-side tool) presented several limitations:

* manual distribution and updates
* local-only model management
* inefficient interaction between students and instructors
* lack of centralized validation and monitoring

---

## Solution

Moloc introduces a **full-stack web platform** that:

* centralizes model storage and validation
* supports multiple users with different roles
* enables version tracking and model history
* simplifies interaction between students and instructors

---

## Key Features

### 👥 User Management

* Authentication system with role-based access (admin / user)
* Session management and route protection
* Secure password handling (hash + salt)

---

### 📄 Model Management & Versioning

* Creation and editing of models
* Version control system (with history tracking)
* Restore previous versions
* Automatic version indexing

---

### 🛠 Integrated Editor

* Built-in text editor for model creation
* Version selection and editing workflow
* Real-time interaction with validation system

---

### ✅ Model Validation Engine

* Migration of an existing validation tool into the platform
* Automatic analysis of model structure
* Error detection and structured feedback
* Dynamic UI highlighting issues

---

### 🧑‍🏫 Admin Dashboard

* User management (create, edit, delete)
* Model inspection across users
* Ability to copy or remove models
* Separation between user and admin workflows

---

## Architecture

The application follows a **Three-Tier Architecture**:

* **Presentation Layer** → EJS templates + frontend logic
* **Application Layer** → Node.js + Express (business logic)
* **Data Layer** → MongoDB (document-based storage)

Additionally, the system is structured using the **Model-View-Controller (MVC)** pattern:

* **Models** → Data schemas (Mongoose)
* **Views** → UI rendering (EJS templates)
* **Controllers** → Application logic and routing

---

## Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB, Mongoose
* **Frontend:** EJS, Bootstrap, JavaScript
* **Auth:** Passport.js

---

## Real Usage & Testing

The platform was deployed on a university server and used in a real academic course.

### Testing Phases:

* **Alpha Testing** → internal validation and debugging
* **Beta Testing** → real users (students)

### Feedback-driven improvements:

* UI/UX enhancements
* navigation improvements
* bug fixes in validation logic
* performance optimizations

User feedback highlighted:

* improved interaction speed with instructors
* better workflow compared to previous system
* overall positive experience

---

## Project Structure

```id="a2k91s"
.
├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── app.js
└── package.json
```

---

## How to Run

```bash id="x3l9qp"
npm install
npm start
```

---

## Notes

* This project was originally developed in a university environment and later consolidated into this repository
* The commit history does not fully reflect the original development process

---

## Screenshots / Demo

Dashboard
<img width="1858" height="941" alt="Screenshot 2026-05-04 123550" src="https://github.com/user-attachments/assets/3538d2d2-8b27-40cc-8ea6-904eb0f91d53" />

---

Overview
<img width="1856" height="944" alt="Screenshot 2026-05-04 124924" src="https://github.com/user-attachments/assets/d7060a12-933e-412e-98c7-2ee12aaf5b0e" />

---

Validation System
<img width="1858" height="914" alt="Screenshot 2026-05-04 124316" src="https://github.com/user-attachments/assets/d442da6e-4a37-46e5-828e-e692f664acb7" />

---

## Key Takeaways

* Designed and implemented a full-stack application
* Applied MVC and three-tier architecture
* Worked with real users and feedback loops
* Migrated and integrated an existing tool into a new system
* Built a platform used in a real academic environment
