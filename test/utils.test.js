const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { capitalize, sum, clamp, truncate } = require('../src/utils');

describe('capitalize', () => {
  it('should capitalize first letter', () => {
    assert.equal(capitalize('hello'), 'Hello');
  });

  it('should return empty string for empty input', () => {
    assert.equal(capitalize(''), '');
  });
});

describe('sum', () => {
  it('should sum an array of numbers', () => {
    assert.equal(sum([1, 2, 3]), 6);
  });

  it('should return 0 for empty array', () => {
    assert.equal(sum([]), 0);
  });
});

describe('clamp', () => {
  it('should clamp value within range', () => {
    assert.equal(clamp(5, 0, 10), 5);
  });

  it('should clamp to min', () => {
    assert.equal(clamp(-5, 0, 10), 0);
  });

  it('should clamp to max', () => {
    assert.equal(clamp(15, 0, 10), 10);
  });
});

describe('truncate', () => {
  it('should truncate long strings with ellipsis', () => {
    assert.equal(truncate('Hello World', 5), 'He...');
  });

  it('should not truncate short strings', () => {
    assert.equal(truncate('Hi', 10), 'Hi');
  });

  it('should handle exact length', () => {
    assert.equal(truncate('Hello', 5), 'Hello');
  });

  it('should handle null/undefined', () => {
    assert.equal(truncate(null, 5), '');
    assert.equal(truncate(undefined, 5), '');
  });

  it('should handle maxLength less than 3', () => {
    assert.equal(truncate('Hello', 2), '..');
  });
});
