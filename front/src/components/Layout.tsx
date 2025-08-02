import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="app">
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/auth/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/auth/register" style={{ marginRight: '1rem' }}>Register</Link>
        <Link to="/data" style={{ marginRight: '1rem' }}>Data</Link>
        <Link to="/user">User</Link>
      </nav>

      <div style={{ padding: '2rem' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

