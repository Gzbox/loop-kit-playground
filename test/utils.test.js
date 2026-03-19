const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { capitalize, sum, clamp } = require('../src/utils');

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

  it('should return 0 for null input', () => {
    assert.equal(sum(null), 0);
  });

  it('should return 0 for undefined input', () => {
    assert.equal(sum(undefined), 0);
  });

  it('should return 0 for string input', () => {
    assert.equal(sum("hello"), 0);
  });

  it('should return 0 for non-array input', () => {
    assert.equal(sum(42), 0);
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
