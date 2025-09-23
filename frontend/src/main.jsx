import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout/Layout";
import AdminLayout from "./layout/AdminLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Boats from "./pages/Boats";
import BoatDetails from "./pages/BoatDetails";
import { AuthProvider } from "./context/AuthContext";
import AdminBoatDetails from "./pages/Admin/Boats/AdminBoatDetails";
import AdminAddBoat from "./pages/Admin/AdminAddBoat";
import MyOrders from "./pages/MyOrders";
import ReservationDetails from "./pages/ReservationDetails";
import ReservationEdit from "./pages/ReservationEdit";
import AdminOrderDetails from "./pages/Admin/Reservations/AdminOrderDetails";
import AdminUserEdit from "./pages/Admin/AdminUserEdit";
import ReviewListContainer from "./pages/Admin/Reviews/ReviewListContainer";
import UserListContainer from "./pages/Admin/Users/UserListContainer";
import ReviewList from "./components/ReviewList";
import ReservationListContainer from "./pages/Admin/Reservations/ReservationListContainer";
import BoatListContainer from "./pages/Admin/Boats/BoatListContainer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/boats", element: <Boats /> },
      { path: "/boats/:id", element: <BoatDetails /> },
      { path: "/reservations/me", element: <MyOrders /> },
      { path: "/reservations/:id", element: <ReservationDetails /> },
      { path: "/reservations/:id/edit", element: <ReservationEdit /> },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "boats", element: <BoatListContainer /> },
      { path: "boats/new", element: <AdminAddBoat /> },
      { path: "boats/:id", element: <AdminBoatDetails /> },
      { path: "reservations", element: <ReservationListContainer /> },
      { path: "reservations/:id", element: <AdminOrderDetails /> },
      { path: "users", element: <UserListContainer /> },
      { path: "users/:id", element: <AdminUserEdit /> },
      { path: "reviews", element: <ReviewListContainer /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
