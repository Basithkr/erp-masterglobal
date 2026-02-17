# MasterGlobal ERP

A full-stack **ERP (Enterprise Resource Planning)** web application built with **Spring Boot**, **React (Vite)**, **PostgreSQL**, and **Docker**.  
The project includes authentication, customer management, order management, and reporting modules, and is fully containerized using **Docker Compose**.

---

## 🧱 Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Spring Security (basic setup)
- PostgreSQL
- Maven

### Frontend
- React (Vite)
- Axios
- React Router
- NGINX (for serving production build)

### DevOps / Tools
- Docker
- Docker Compose
- NGINX (reverse proxy for API)
- Git & GitHub

---

## ⚙️ Features

- ✅ User login (authentication)
- ✅ Customer management (CRUD)
- ✅ Order management
- ✅ Reports module (basic structure)
- ✅ RESTful APIs with Spring Boot
- ✅ React frontend with protected routes
- ✅ NGINX reverse proxy for `/api`
- ✅ Fully containerized with Docker Compose

---

## 🐳 Running the Project with Docker

### 🔹 Prerequisites

- Docker Desktop installed
- Docker Compose enabled

---

### ▶️ Start the application

From the project root:

```bash
docker compose down
docker compose build --no-cache
docker compose up


