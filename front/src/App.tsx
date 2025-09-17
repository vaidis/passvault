import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './AuthContext';
import { Header } from '../src/components/Header';
import AppRoutes from './router/AppRoutes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
