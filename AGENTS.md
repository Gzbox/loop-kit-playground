# AGENTS.md

Agent guidance for working on **loop-kit-playground**.

## Project overview

A simple Node.js utility library used as a test playground for [Loop Kit](https://github.com/Gzbox/loop-kit). Contains basic utility functions (`capitalize`, `sum`, `clamp`) with tests.

## Build and test commands

```bash
npm test          # Run all tests (Node.js built-in test runner)
```

No build step required — this is a plain CommonJS module.

## Environment

- Node.js 20+
- No external dependencies
- CommonJS modules

## Editing rules

- Keep changes focused
- Follow existing code style (JSDoc comments, `module.exports`)
- Write tests for all new functions
- Do not add unnecessary dependencies — use Node.js built-in APIs when possible
- TDD: write failing test first, then implement

## Do NOT

- Add a bundler or transpiler — this project stays simple
- Introduce TypeScript — keep it plain JS for testing purposes
- Add external test frameworks — use `node:test` built-in
