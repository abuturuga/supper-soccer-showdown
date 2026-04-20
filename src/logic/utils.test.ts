import { describe, it, expect } from 'vitest';
import { generateRandomNumber } from './utils';

describe('generateRandomNumber', () => {
    it('returns an integer within [0, max)', () => {
        for (let i = 0; i < 100; i++) {
            const n = generateRandomNumber(10);
            expect(n).toBeGreaterThanOrEqual(0);
            expect(n).toBeLessThan(10);
            expect(Number.isInteger(n)).toBe(true);
        }
    });

    it('always returns 0 when max is 1', () => {
        for (let i = 0; i < 20; i++) {
            expect(generateRandomNumber(1)).toBe(0);
        }
    });
});
