import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Clock } from "./Clock";
import { Profile } from "./Profile";
import Status from "./Status";
import './Header.scss'

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="header">
      <Status />
      {isAuthenticated && (
        <>
          <nav className="navigation">
            <Link to="/data" style={{ marginRight: "1rem" }}>
              Data
            </Link>
            <Link to="/auth/user" style={{ marginRight: "1rem" }}>
              <Profile />
            </Link>
            <Link to="/auth/logout">Logout</Link>
          </nav>
          <Clock />
        </>
      )}
    </div>
  );
};
