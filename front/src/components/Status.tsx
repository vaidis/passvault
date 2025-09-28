import React from 'react';
import { statsApi } from "../api/stats";
import type { Stats } from '../api/types';
import './Status.scss';

function formatBytes(bytes: number): string {
  const MB = 1024 * 1024;
  const GB = MB * 1024;

  if (bytes >= GB) {
    return Math.floor(bytes / GB) + "G";
  } else if (bytes >= MB) {
    return Math.floor(bytes / MB) + "M";
  } else {
    return Math.floor(bytes / 1024) + "K";
  }
}

const Status: React.FC = () => {
  const [data, setData] = React.useState<Stats | null>(null);
  const intervalMs = 5000;

  React.useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const schedule = (ms: number) => {
      if (!cancelled) timer = window.setTimeout(tick, ms);
    };

    const tick = async () => {
      try {
        const response = await statsApi.getStats();
        if (response.success && response.data) {
            setData(response.data);
        }
      } catch (err) {
        console.error("statusApi.get failed:", err);
      } finally {
        schedule(intervalMs);
      }
    };

    tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);


  return (
    <div className='stats'>
      {
        data?.diskTotal &&
        data?.diskFree &&
        <div>DSK {formatBytes(data.diskFree)}({formatBytes(data.diskTotal)})</div>
      }
      {
        data?.memoryTotal  &&
        data?.memoryFree &&
        <div>MEM {formatBytes(data.memoryFree)}({formatBytes(data.memoryTotal)})</div>
      }
      {
        data?.sysUptime  &&
        <div>UPT {data.sysUptime}</div>
      }
      {
        data?.cpuLoadAavg  &&
        <div>CPU {data.cpuLoadAavg}%</div>
      }
    </div>
  );
};
export default Status;
