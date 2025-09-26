import os from "os";
import { statfs } from 'fs';
import { promises as fsp } from "fs";
import { Request, Response } from 'express';

type DiskStats = {
    total: number;   // bytes
    used: number;    // bytes
    free: number;    // bytes (bfree)
    avail: number;   // bytes (bavail - για μη root)
};

type RawDisk = {
  name: string;
  readsCompleted: number;
  readsMerged: number;
  sectorsRead: number;
  timeReadingMs: number;
  writesCompleted: number;
  writesMerged: number;
  sectorsWritten: number;
  timeWritingMs: number;
  ioInProgress: number;
  timeDoingIOms: number;
  weightedTimeDoingIOms: number;
};

type DiskIORate = {
  name: string;
  readIOPS: number;
  writeIOPS: number;
  readMBps: number;
  writeMBps: number;
  utilPct: number; // approx % busy time during interval
};

const SECTOR_SIZE = 512;
const INCLUDE = /^sd[a-z]+$|^nvme\d+n\d+$/;

function parseDiskstats(text: string): RawDisk[] {
  // /proc/diskstats: https://www.kernel.org/doc/Documentation/iostats.txt
  const out: RawDisk[] = [];
  for (const line of text.trim().split("\n")) {
    const f = line.trim().split(/\s+/);
    const name = f[2];
    if (!INCLUDE.test(name)) continue;
    out.push({
      name,
      readsCompleted: Number(f[3]),
      readsMerged: Number(f[4]),
      sectorsRead: Number(f[5]),
      timeReadingMs: Number(f[6]),
      writesCompleted: Number(f[7]),
      writesMerged: Number(f[8]),
      sectorsWritten: Number(f[9]),
      timeWritingMs: Number(f[10]),
      ioInProgress: Number(f[11]),
      timeDoingIOms: Number(f[12]),
      weightedTimeDoingIOms: Number(f[13]),
    });
  }
  return out;
}

async function getDiskStats(pathToCheck = "/"): Promise<DiskStats> {
    const s = await fsp.statfs(pathToCheck);
    const blockSize = s.bsize;           // bytes per block
    const total = blockSize * s.blocks;
    const free = blockSize * s.bfree;   // includes reserved
    const avail = blockSize * s.bavail;  // available to μη-root
    const used = total - free;
    return { total, used, free, avail };
}

export const getStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const disk = await getDiskStats("/");

        const response = {
            diskTotal: disk.total,
            diskFree: disk.free,
            diskAvail: disk.avail,                    // όλα σε bytes
            memoryTotal: os.totalmem(), // bytes
            memoryFree: os.freemem(),   // bytes
            sysUptime: os.uptime(),     // seconds
            cpuLoadAavg: os.loadavg(),   // [1m, 5m, 15m]
        };

        res.json(response);
        return;
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
};
