type RateLimitOptions = {
  windowMs: number;
  max: number;
};

const store = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(ip: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  const existing = store.get(ip);

  if (existing && existing.expiresAt > now) {
    if (existing.count >= options.max) {
      return false;
    }
    existing.count += 1;
    store.set(ip, existing);
    return true;
  }

  store.set(ip, { count: 1, expiresAt: now + options.windowMs });
  return true;
}

