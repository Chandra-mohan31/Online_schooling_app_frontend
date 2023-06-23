import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RegisterComponent from './components/RegisterComponent/RegisterComponent';
import LoginComponent from './components/LoginComponent/LoginComponent';
import Protected from './components/Protected';


const router = createBrowserRouter([
  {
    path:"/",
    element:(
      <Protected>
        <App />
      </Protected>
    ),
  },
  {
    path:"/login",
    element:(
      <LoginComponent />
    )
  },{
    path:"/register",
    element:(
      <RegisterComponent />
    )
  },
  {
    path:"/dashboard",
    element:(
      <Protected>
        <div>User dashboard</div>
      </Protected>
    )
  }
])

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
        <RouterProvider router={router} />

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
