import React from 'react';
import { createRoot } from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import AssignmentComponent from './components/AssignmentComponent/AssignmentComponent';
import CoursesComponent from './components/CoursesComponent/CoursesComponent';
import DashBoardMain from './components/DashboardComponents/DashBoardMain';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import LoginComponent from './components/LoginComponent/LoginComponent';
import MeetingComponent from './components/MeetingComponent/MeetingComponent';
import NavbarComponent from './components/NavbarComponent/Navbar';
import NotLoggedIn from './components/NotLoggedIn';
import ProfileComponent from './components/ProfileComponent/ProfileComponent';
import Protected from './components/Protected';
import RegisterComponent from './components/RegisterComponent/RegisterComponent';
import StudyMaterialMain from './components/StudyMaterials/StudyMaterialMain';
import ViewStudyMaterial from './components/StudyMaterials/ViewStudyMaterial';
import ViewAssignmentSubmissions from './components/ViewAssignmentSubmissions/ViewAssignmentSubmissions';
import { GlobalAuthStateProvider } from './context/authContext';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ChatComponent from './components/ChatComponent/ChatComponent';
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <NavbarComponent />

        <Navigate to="/dashboard" />
      </Protected>
    ),
  },
  {
    path: "/courses",
    element: (
      <Protected>
        <NavbarComponent />

        <CoursesComponent />
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
    path: "/profile",
    element: (
      <Protected>
      
      
        <NavbarComponent />
        <ProfileComponent />
      </Protected>
    )
  },
  {
    path: "/chat/:userId",
    element: (
      <Protected>
      
      
        <NavbarComponent />
        <ChatComponent />
      </Protected>
    )
  },
  {
    path: "/studymaterials",
    element: (
      <Protected>
      
      
        <NavbarComponent />
        <StudyMaterialMain />
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
  },
  {
    path: "/customerSupport",
    element: (
      <Protected>
        <NavbarComponent />

        <div>
          Customer Support
        </div>
        {/* <LinearLoading>
          <Box>
            <Typography variant='body1' textAlign='center'>Dont refresh or go back , wait for a while it may take a few minutes!</Typography>
          </Box>
        </LinearLoading> */}
      </Protected>
    )
  },
  {
    path:"/joinClass/:roomID",
    element:(
      <Protected>
      <MeetingComponent />

      </Protected>
    )
  },
  {
    path:"/viewsubmissions/:assignmentCode/:className",
    element:(
      <Protected>
      <NavbarComponent />
      <ViewAssignmentSubmissions />

      </Protected>
    )
  },
  {
    path:"/assignments",
    element:(
      <Protected>
        <NavbarComponent />
      <AssignmentComponent />

      </Protected>
    )
  },
  {
    path:"/viewmaterial/:materialId",
    element:(
      <Protected>
        <NavbarComponent />
      <ViewStudyMaterial />

      </Protected>
    )
  }
])

createRoot(document.getElementById("root")).render(
    <GlobalAuthStateProvider>
    <RouterProvider router={router} />

    </GlobalAuthStateProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
