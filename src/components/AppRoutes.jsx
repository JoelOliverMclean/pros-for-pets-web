import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/user/Login";
import Registration from "../pages/user/Registration";
import Pets from "../pages/pet/Pets";
import Pet from "../pages/pet/Pet";
import PetForm from "../pages/pet/PetForm";
import ManageBusiness from "../pages/business/ManageBusiness";
import BusinessForm from "../pages/business/BusinessForm";
import ServiceForm from "../pages/business/services/ServiceForm";
import BusinessSearch from "../pages/business/BusinessSearch";
import Business from "../pages/business/Business";
import ManageClients from "../pages/business/ManageClients";
import BookingSlots from "../pages/business/booking_slots/BookingSlots";
import BookingSlotForm from "../pages/business/booking_slots/BookingSlotForm";
import Dashboard from "../pages/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pets/new-pet" element={<PetForm />} />
      <Route path="/pets/:slug/edit" element={<PetForm />} />
      <Route path="/pets/:slug" element={<Pet />} />
      <Route path="/pets" element={<Pets />} />
      <Route path="/manage-business/booking-slots" element={<BookingSlots />} />
      <Route
        path="/manage-business/booking-slots/new"
        element={<BookingSlotForm />}
      />
      <Route path="/manage-business/edit" element={<BusinessForm />} />
      <Route path="/manage-business/clients" element={<ManageClients />} />
      <Route path="/manage-business/new-service" element={<ServiceForm />} />
      <Route
        path="/manage-business/edit-service/:slug"
        element={<ServiceForm />}
      />
      <Route path="/manage-business" element={<ManageBusiness />} />
      <Route path="/new-business" element={<BusinessForm />} />
      <Route path="/businesses/:slug" element={<Business />} />
      <Route path="/businesses" element={<BusinessSearch />} />
    </Routes>
  );
}

export default AppRoutes;
