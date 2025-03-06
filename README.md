# MERN Cursor AI Web Application

This is a MERN-based web application where users can input a query, and the application uses **Cursor AI** to generate responses. The application consists of a **React.js frontend** and a **Node.js + Express.js backend**, with **MongoDB** as the database.

---

## **Features**
- **Frontend**:
  - User-friendly interface with an input field for queries.
  - Displays AI-generated responses.
  - Loading indicators and error handling for better UX.

- **Backend**:
  - API endpoint (`/api/generate`) to process user queries using Cursor AI.
  - Stores user queries and AI responses in MongoDB.
  - Proper validation and error handling.

- **Database**:
  - MongoDB Atlas for storing user queries and AI responses.

---

## **Technologies Used**
- **Frontend**: React.js (Vite), TailwindCSS (optional)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **AI Integration**: Cursor AI API
- **Deployment**:
  - Frontend: Vercel or Netlify
  - Backend: Render, AWS, or Railway
  - Database: MongoDB Atlas

---

## **Prerequisites**
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cursor AI API key
- Git (optional)

---

## **Setup and Installation**

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/mern-cursor-ai-app.git
cd mern-cursor-ai-app
```

### **2. Backend Setup**

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the backend folder and add the following:
```bash
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.sa6sy.mongodb.net/<dbname>?retryWrites=true&w=majority
CURSOR_AI_API_KEY=your_cursor_ai_api_key
PORT=5000
```

* Replace <username>, <password>, and <dbname> with your MongoDB Atlas credentials.
* Replace your_cursor_ai_api_key with your Cursor AI API key.
  
4. Start the backend server:
```bash
npm run dev
```
The backend will run on http://localhost:5000.

### **3. Frontend Setup**
1. Navigate to the frontend folder:
```bash
cd ../frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the backend server:
```bash
npm run dev
```
The frontend will run on http://localhost:5173.

### **4. MongoDB Atlas Setup**
1. Log in to your MongoDB Atlas account.
2. Create a new cluster and database.
3. Whitelist your IP address in the Network Access section.
4. Get the connection string and update the MONGO_URI in the .env file.

### **5. Open/Cursor AI Setup**
1. Sign up for open/Cursor AI and get your API key.
2. Update the OPEN_AI_API_KEY/CURSOR_AI_API_KEY in the .env file.

### Running the Application
1. Start the backend:
```bash
cd backend
npm run dev
```

2. Start the frontend:
```bash
cd ../frontend
npm run dev
```
3. Open the application in your browser:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api/generate
