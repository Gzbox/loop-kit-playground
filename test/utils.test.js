const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { capitalize, sum, clamp, slugify } = require('../src/utils');

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

describe('slugify', () => {
  it('should convert spaces to hyphens', () => {
    assert.equal(slugify('Hello World'), 'hello-world');
  });

  it('should trim and collapse whitespace', () => {
    assert.equal(slugify('  Foo  Bar  '), 'foo-bar');
  });

  it('should collapse multiple hyphens', () => {
    assert.equal(slugify('Hello---World'), 'hello-world');
  });

  it('should remove special characters', () => {
    assert.equal(slugify('Hello, World!'), 'hello-world');
  });

  it('should handle empty string', () => {
    assert.equal(slugify(''), '');
  });

  it('should handle null/undefined', () => {
    assert.equal(slugify(null), '');
    assert.equal(slugify(undefined), '');
  });

  it('should handle already slugified string', () => {
    assert.equal(slugify('hello-world'), 'hello-world');
  });
});
