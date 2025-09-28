// Ping.tsx
import React, { useEffect, useRef, useState } from "react";

type Props = {
    endpoint?: string;
    intervalMs?: number;
    timeoutMs?: number;
};

const Ping: React.FC<Props> = ({
    endpoint = "http://localhost:5173/ping",
    intervalMs = 2000,
    timeoutMs = 1500,
}) => {
    const [latencyMs, setLatencyMs] = useState<number | null>(null);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        const pingOnce = async () => {
            const controller = new AbortController();
            const to = setTimeout(() => controller.abort(), timeoutMs);
            const start = performance.now();
            try {
                const res = await fetch(endpoint, {
                    method: "GET",
                    signal: controller.signal,
                    cache: "no-store",
                    headers: {
                        "Cache-Control": "no-cache",
                        "Pragma": "no-cache",
                    },
                });
                const end = performance.now();
                clearTimeout(to);

                if (!res.ok && res.status !== 204) {
                    throw new Error(String(res.status));
                }
                setLatencyMs(end - start);
            } catch {
                clearTimeout(to);
                setLatencyMs(null);
            }
        };

        pingOnce();
        timerRef.current = window.setInterval(pingOnce, intervalMs) as unknown as number;
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [endpoint, intervalMs, timeoutMs]);

    return <span>Latency: {latencyMs !== null ? Math.round(latencyMs) : "—"}ms</span>;
};

export default Ping;
