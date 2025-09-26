import React from 'react';
import { statsApi } from "../api/stats";
import type { Stats } from "../api/types";

const Status: React.FC = () => {
  const [data, setData] = React.useState();

  React.useEffect(() => {
    (async () => {
      try {
        const response = await statsApi.getStats();
        if (response.success) {
          const data = response.data;
          if (data !== undefined) {
            setData(data);
          }
        }
      } catch (error) {
        console.log("Data.tsx error:", error);
      }
    })();
    return;
  }, []);

  return (
    <div>
      <h1>Status</h1>
      {JSON.stringify(data)}
    </div>
  );
};

export default Status;
