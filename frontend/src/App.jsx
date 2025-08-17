import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Component Imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import GalleryPage from './pages/GalleryPage';
import EventsPage from './pages/EventsPage';
import AlumniDirectoryPage from './pages/AlumniDirectoryPage';
import StudentDirectoryPage from './pages/StudentDirectoryPage';
import ContactUsPage from './pages/ContactUsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage'; // <-- ADD THIS LINE

function App() {
  return (
    <Router>
      <Navbar /> 
      <main>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/alumni-directory" element={<AlumniDirectoryPage />} />
          <Route path="/student-directory" element={<StudentDirectoryPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} /> {/* <-- ADD THIS LINE */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;