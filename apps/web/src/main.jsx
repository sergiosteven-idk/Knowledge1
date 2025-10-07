import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import A11yBar from "./components/A11yBar.jsx";

import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";


import Dashboard from "./pages/adminZone/Dashboard.jsx";
import Manageuser from "./pages/adminZone/Manageuser.jsx";
import UserCards from "./pages/adminZone/UserCards.jsx";
import Uploadfiles from "./pages/adminZone/Uploadfiles.jsx";
import AdminProfile from "./pages/adminZone/AdminProfile.jsx";

import Discapacidad from "./pages/discapacidad.jsx";
import Informacion from "./pages/informacion.jsx";
import Contacto from "./pages/contacto.jsx";
import TyC from "./pages/tyc.jsx";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Barra de accesibilidad global */}
      <A11yBar />
      <main className="max-w-6xl mx-auto p-4 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "discapacidad", element: <Discapacidad /> },
      { path: "informacion", element: <Informacion /> },
      { path: "contacto", element: <Contacto /> },
      { path: "tyc", element: <TyC /> },

      { path: "login", element: <GuestRoute><Login /></GuestRoute> },
      { path: "signup", element: <GuestRoute><Signup /></GuestRoute> },

      {
        path: "admin",
        element: (
          <PrivateRoute>
            <Outlet />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: "manage-users", element: <Manageuser /> },
          { path: "user-cards", element: <UserCards /> },
          { path: "upload-files", element: <Uploadfiles /> },
          { path: "profile", element: <AdminProfile /> },
        ],
      },
    ],
  },
]);

const qc = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={qc}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
