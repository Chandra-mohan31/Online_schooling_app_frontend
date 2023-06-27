import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import RegisterComponent from './components/RegisterComponent/RegisterComponent';
import LoginComponent from './components/LoginComponent/LoginComponent';
import Protected from './components/Protected';
import { isLoggedIn } from "./backend_helper/index";
import NotLoggedIn from './components/NotLoggedIn';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import NavbarComponent from './components/NavbarComponent/Navbar';
import { GlobalAuthStateProvider } from './context/authContext';
import DashBoardMain from './components/DashboardComponents/DashBoardMain';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <NavbarComponent />

        <App />
      </Protected>
    ),
  },
  {
    path: "/login",
    element: (
      <NotLoggedIn>
        <NavbarComponent />

        <LoginComponent />
      </NotLoggedIn>
    )
  }, {
    path: "/register",
    element: (
      <NotLoggedIn>
        <NavbarComponent />
        <RegisterComponent />

      </NotLoggedIn>
    )
  },
  {
    path: "/dashboard",
    element: (
      <Protected>
        <NavbarComponent />
        <DashBoardMain />
      </Protected>
    )
  },
  {
    path: "/forgotpassword",
    element: (
      <NotLoggedIn>
        <NavbarComponent />

        <ForgotPassword />
      </NotLoggedIn>
    )
  }
])

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalAuthStateProvider>
    <RouterProvider router={router} />

    </GlobalAuthStateProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
