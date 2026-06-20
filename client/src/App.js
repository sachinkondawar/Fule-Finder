import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider, AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, role } = useContext(AuthContext);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
          <Navbar />
          <main className="pt-24 pb-16 px-4 sm:px-6 w-full max-w-7xl mx-auto flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Secure Admin Route */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;