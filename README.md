# 🌟 MyDrive - A MERN Stack SaaS for File Management

**MyDrive** is a cloud-based SaaS platform inspired by Google Drive, built with the **MERN stack** and **Socket.IO** for real-time updates. It allows users to manage folders, upload files, collaborate with others, and chat in real-time.

---

## 🚀 Features

### **User Authentication**
- Users can **create an account** and **log in** with a unique username and password.  
- Secure authentication ensures data privacy.

### **Folder & File Management**
- **CRUD operations** on folders: create, read, update, delete.  
- **File uploads** inside folders.  
- Share folders with other users via **collaboration links**.

### **Collaboration**
- Users receiving a collaboration link can **accept or deny access** within 7 days.  
- If accepted, collaborators can **read folder content** and **upload new files**.  
- Only the **folder creator (admin)** can delete the folder. Collaborators have restricted access.

### **Real-time Chat**
- All participants (folder admin + collaborators) can **chat in real-time**.  
- Powered by **Socket.IO** for instant messaging within shared folders.

### **Security & Access Control**
- Role-based permissions: **Admin vs Collaborator**.  
- Expiring collaboration links for enhanced security.

---

## 💻 Tech Stack

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Real-time Communication:** Socket.IO  
- **File Storage:** GridFS (MongoDB)

---

PORT= Your Port
MONGO_URI= Your mongo db URI
JWT_SECRET= Your secret key


