import { createHmac } from 'crypto'
import seedrandom from 'seedrandom'

export function createSeed(userId: string, timestamp: number, secret: string): string {
  return createHmac('sha256', secret)
    .update(`${userId}:${timestamp}`)
    .digest('hex')
}

export function createRNG(seed: string) {
  const rng = seedrandom(seed)

  return {
    next: (): number => rng(),
    range: (min: number, max: number): number =>
      Math.floor(rng() * (max - min + 1)) + min,
    choice: <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)],
    weighted: <T>(items: Array<{ value: T; weight: number }>): T => {
      const total = items.reduce((s, i) => s + i.weight, 0)
      let r = rng() * total
      for (const item of items) {
        r -= item.weight
        if (r <= 0) return item.value
      }
      return items[items.length - 1].value
    },
  }
}
