class TokenBucket {
  private queue: (() => void)[] = [];

  constructor(refillAfterMs: number) {
    setInterval(() => this.queue.shift()?.(), refillAfterMs);
  }

  public async acquire() {
    await new Promise<void>((resolve) => this.queue.push(resolve));
  }
}

export function rateLimit(fetchFn: typeof fetch, intervalMs: number) {
  const tokenBucket = new TokenBucket(intervalMs);

  return async (...args: Parameters<typeof fetchFn>) => {
    await tokenBucket.acquire();
    return await fetchFn(...args);
  };
}
