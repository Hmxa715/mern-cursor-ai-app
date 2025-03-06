import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import QueryForm from "./components/QueryForm.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import Layout from "./components/layout/Layout/Layout.js";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="mx-auto">
                    <div className="bg-white p-6 mb-8 text-left">
                      <h1 className="font-bold text-gray-900 mb-2">
                        Cursor AI Query
                      </h1>
                      <p className="text-gray-600">
                        Ask anything and get AI-powered responses
                      </p>
                    </div>
                    <QueryForm />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
