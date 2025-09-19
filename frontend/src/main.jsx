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
import AdminBoatList from "./pages/Admin/AdminBoatList";
import AdminBoatDetails from "./pages/Admin/AdminBoatDetails";
import AdminAddBoat from "./pages/Admin/AdminAddBoat";
import MyOrders from "./pages/MyOrders";
import ReservationDetails from "./pages/ReservationDetails";
import ReservationEdit from "./pages/ReservationEdit";
import AdminOrdersList from "./components/admin/AdminOrdersList";
import AdminOrderDetails from "./components/admin/AdminOrderDetails";
import AdminUserList from "./pages/Admin/AdminUserList";
import AdminUserEdit from "./pages/Admin/AdminUserEdit";

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
      { path: "boats", element: <AdminBoatList /> },
      { path: "boats/new", element: <AdminAddBoat /> },
      { path: "boats/:id", element: <AdminBoatDetails /> },
      { path: "reservations", element: <AdminOrdersList /> },
      { path: "reservations/:id", element: <AdminOrderDetails /> },
      { path: "users", element: <AdminUserList /> },
      { path: "users/:id", element: <AdminUserEdit /> },
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
