import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import OnboardingPage from './pages/onBoarding';
import LoginPage from './pages/auth';
import HomePage from './pages/home';
import DetailsPage from './pages/details';
import ExperiencePage from './pages/experience';
import FavouritePage from './pages/favourite';
import MyTripsPage from './pages/MyTrips';
import PlanPage from './pages/plan';
import PaymentPage from './pages/paymentPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import CategoryListPage from './pages/categorylist';
import CityHotelPage from './pages/cityhotelPage';
import CityExperiencePage from './pages/cityExperincePage';
import HostRoutes from './routes/HostRoutes';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/auth" element={<LoginPage />} />

        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/details/:id" element={<PrivateRoute><DetailsPage /></PrivateRoute>} />
        <Route path="/experience/:id" element={<PrivateRoute><ExperiencePage /></PrivateRoute>} />
        <Route path="/favourites" element={<PrivateRoute><FavouritePage /></PrivateRoute>} />
        <Route path="/my-trips" element={<PrivateRoute><MyTripsPage /></PrivateRoute>} />
        <Route path="/plan" element={<PrivateRoute><PlanPage /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><CategoryListPage /></PrivateRoute>} />
        <Route path="/city/hotels/:city" element={<PrivateRoute><CityHotelPage /></PrivateRoute>} />
        <Route path="/city/experiences/:city" element={<PrivateRoute><CityExperiencePage /></PrivateRoute>} />

        <Route path="/host/*" element={<PrivateRoute><HostRoutes /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
