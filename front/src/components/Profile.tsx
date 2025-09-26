import React from "react";
import { useAuth } from "../AuthContext";

export const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="clock">
      <div>Hello {user?.username}</div>
    </div>
  );
};
