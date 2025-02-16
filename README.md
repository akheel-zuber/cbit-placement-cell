# CBIT Placement Cell Web Application

## Overview
This is a web-based application designed for the CBIT Placement Cell to manage and streamline the placement process. The application allows students to register, apply for job opportunities, and view placement statistics. Recruiters can post job openings, and the admin can manage placement drives efficiently.

The project is built using the **MERN stack** with additional dependencies such as **Argon2 for password hashing, Express-Session for session management, and Nodemailer for email notifications.**

---

## Features

### **For Students:**
- User registration & login with password hashing (Argon2)
- Apply for job opportunities
- View available job postings
- Track placement statistics

### **For Recruiters:**
- Post new job openings
- Define job criteria (eligibility, job type, role, etc.)
- Manage applications

### **For Admins:**
- Manage users and job postings
- Monitor placement statistics
- Store and retrieve placement history

### **Other Functionalities:**
- Secure session management
- Contact form with email notifications using Nodemailer
- MongoDB for data storage

---

## Tech Stack

### **Frontend:**
- EJS (Embedded JavaScript Templates)
- HTML, CSS, Bootstrap

### **Backend:**
- Node.js
- Express.js

### **Database:**
- MongoDB (Mongoose ORM)

### **Authentication & Security:**
- Argon2 (for secure password hashing)
- Express-Session (session management)

### **Other Tools & Libraries:**
- Nodemailer (email communication)
- Body-Parser (handling form submissions)
- Path (handling file paths)

---

## Installation Guide

### **Prerequisites**
Make sure you have the following installed:
- Node.js
- MongoDB (running locally or hosted on MongoDB Atlas)

### **Setup Steps**

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/cbit-placement-cell.git
   cd cbit-placement-cell
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the project root.
   - Add the following environment variables:
     ```env
     PORT=3000
     MONGO_URI=mongodb://localhost:27017/cbit_placement_cell
     SESSION_SECRET=your_secret_key
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_email_password
     ```

4. **Start the MongoDB server (if running locally):**
   ```sh
   mongod
   ```

5. **Run the application:**
   ```sh
   npm start
   ```
   or using Nodemon (for development):
   ```sh
   nodemon app.js
   ```

6. **Visit in the browser:**
   - Open: [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### **Authentication**
| Method | Endpoint  | Description |
|--------|----------|-------------|
| POST   | `/signin` | Register a new user |
| POST   | `/login` | User login |

### **Job Opportunities**
| Method | Endpoint  | Description |
|--------|----------|-------------|
| GET   | `/placement_drive` | View all job postings |
| GET   | `/placement_drive/:zz` | View a specific job posting |
| POST  | `/add_oppr` | Add a new job posting |

### **Recruitment & Statistics**
| Method | Endpoint  | Description |
|--------|----------|-------------|
| GET   | `/recruited` | View recruited students |
| GET   | `/stats` | View placement statistics |
| POST  | `/adding_rec` | Add recruitment details |

### **Contact**
| Method | Endpoint  | Description |
|--------|----------|-------------|
| POST  | `/contact` | Send a message to the admin |

---

## Project Structure
```
📁 cbit-placement-cell
│-- 📁 public             # Static files (CSS, JS, images)
│-- 📁 src
|    │-- 📄 app.js             # Main Express application
│-- 📁 views              # web pages
│-- 📄 package.json       # Dependencies and scripts
```

---

## Future Enhancements
- Implement **JWT-based authentication** for better security.
- Integrate **resume upload feature** for students.
- Add an **admin dashboard** for job and user management.
- Enable **real-time notifications** for job postings.

---

## Contributors
- **Meer Aakif** - ([http://localhost:3000](https://github.com/meer-aakif-33))

If you’d like to contribute, feel free to submit a **pull request** or open an **issue**.

---

## License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---
