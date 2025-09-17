import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="app">
      {isAuthenticated ? <>
        <nav className='navigation'>
          <Link to="/data" style={{ marginRight: '1rem' }}>Data</Link>
          <Link to="/auth/user" style={{ marginRight: '1rem' }}>User</Link>
          <Link to="/auth/logout">Logout</Link>
        </nav>
        </>
        : <>
        <Link to="/auth/login" style={{ marginRight: '1rem' }}>Login</Link>
      </>}
    </div>
  );
};
