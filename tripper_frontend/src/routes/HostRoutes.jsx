import React from "react";
import { Routes, Route } from "react-router-dom";
import HostLayout from "../components/host/HostLayout";
import MyListings from "../pages/host/MyListings";
import HostProfile from "../pages/host/HostProfile";
import Reservations from "../pages/host/reservations/Reservations";
import Dashboard from "../pages/host/Dashboard";
import EditProfile from "../pages/host/EditProfile";
import TopAttractions from "../pages/host/Places";
import Places from "../pages/host/Places";

import AddHotel from "../pages/host/hotel/AddHotel";
import EditHotel from "../pages/host/hotel/EditHotel";
import AddExperienceWizard from "../pages/host/experiences/add-experience/AddExperienceWizard";
import EditExperiencePage from "../pages/host/experiences/update-experience/EditExperiencePage";
import HotelReservationDetails from "../pages/host/reservations/HotelReservationDetails";
import ExperienceReservationDetails from "../pages/host/reservations/ExperienceReservationDetails";
import ProfilePage from "../pages/ProfilePage";
import ChatPage from "../pages/ChatPage";


const HostRoutes = () => {
  return (
    <HostLayout>
      <Routes>
        {/* Dashboard host */}
        <Route path="/dashboard" element={<Dashboard />} />


        {/*  listings  */}
        <Route path="/listings" element={<MyListings />} />

        <Route path="/add-hotel" element={<AddHotel />} />
        <Route path="/hotels/edit/:id" element={<EditHotel />} />
          <Route path="/chat" element={<ChatPage />} />


        <Route path="/experiences/add" element={<AddExperienceWizard />} />
        <Route path="/experiences/update/:id" element={<EditExperiencePage />} />

        {/* reservations */}
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/reservations/:id" element={<HotelReservationDetails />} />
        <Route path="/reservations/experience/:id" element={<ExperienceReservationDetails />} />


        {/*  profile */}

        <Route path="/profile" element={<ProfilePage />} />
        
        {/* <Route path="/profile" element={<HostProfile />} /> */}
        
        <Route path="/edit-profile" element={<EditProfile />} />


      </Routes>
    </HostLayout>
  );
};

export default HostRoutes;
