import type { Request } from "express";

export function getClientIp(req: Request | any): string {
  let fwd: string | null | undefined =
    typeof req.get === "function" ? req.get("x-forwarded-for") : undefined;

  if (!fwd && req.headers && typeof req.headers.get === "function") {
    fwd = req.headers.get("x-forwarded-for");
  }

  const fromHeader = fwd?.split(",")[0].trim();
  const fallback = req.ip ?? req.socket?.remoteAddress ?? "";
  const ip = (fromHeader || fallback || "").replace(/^::ffff:/, "");
  return ip;
}
