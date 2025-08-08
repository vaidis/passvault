export function getLastUrlSegment(): string | null {
  const path = window.location.pathname; // e.g. "/dashboard/users/42"
  const segments = path.split('/').filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : null;
}

