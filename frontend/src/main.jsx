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
// Admin pages
// import AdminBoatList from "./pages/admin/BoatList";
// import AdminBoatDetails from "./pages/admin/BoatDetails";
// import AddBoat from "./pages/admin/AddBoat";
// import Orders from "./pages/admin/Orders";
// import Users from "./pages/admin/Users";

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
      // { path: "orders", element: <Orders isAdminView={true} /> },
      // { path: "users", element: <Users isAdminView={true} /> },
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
