import { createBrowserRouter, Navigate } from 'react-router-dom';

import Layout from '../components/Layout';
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';
import Data from '../pages/Data';
import User from '../pages/User';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register/:registerId',
            element: <Register />,
          },
        ],
      },
      {
        path: 'data',
        element: <Data />,
      },
      {
        path: 'user',
        element: <User />,
      },
      {
        path: '*',
        element: <div>Page not found</div>,
      },
    ],
  },
]);

