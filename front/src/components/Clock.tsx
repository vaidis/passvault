import React from "react";
import { useAuth } from "../AuthContext";

function formatMsToMMSS(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}


export const Clock: React.FC = () => {
  const { timeStart, timeEnd, timeRemain, isAuthenticated, user, refresh } = useAuth();

  return (
    <div className="clock">
      <div>Time Start_____: {String(timeStart)}</div>
      <div>Time End_______: {String(timeEnd)}</div>
      <div>isAuthenticated: {JSON.stringify(isAuthenticated)}</div>
      <div>user.username__: {user?.username}</div>
      <button onClick={() => refresh()}>
        {formatMsToMMSS(timeRemain)}
      </button>
    </div>
  );
};
