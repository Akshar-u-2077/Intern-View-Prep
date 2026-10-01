import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStreakState } from './streak.ts';

test('calculates the active streak across consecutive days', () => {
  const today = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const isoDate = (daysAgo: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const result = calculateStreakState([
    isoDate(0),
    isoDate(1),
    isoDate(2),
    isoDate(4),
    isoDate(5),
  ]);

  assert.equal(result.streakCurrent, 3);
  assert.equal(result.streakLongest, 3);
});

test('resets the streak when there is a gap', () => {
  const today = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const isoDate = (daysAgo: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const result = calculateStreakState([
    isoDate(0),
    isoDate(3),
    isoDate(4),
  ]);

  assert.equal(result.streakCurrent, 1);
  assert.equal(result.streakLongest, 2);
});
