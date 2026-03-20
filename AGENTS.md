# AGENTS.md

## Project Overview
Loop Kit Playground — a simple Node.js utility library used to test [Loop Kit](https://github.com/Gzbox/loop-kit)'s `/loop` workflow end-to-end. Contains utility functions (`capitalize`, `sum`, `clamp`, `truncate`, `slugify`) with full test coverage, plus a static landing page.

## Tech Stack
- Language: JavaScript (Node.js)
- Framework: None (vanilla Node.js)
- Build tool: npm
- Test runner: `node:test` (built-in)

## Build & Test Commands

| Command | Purpose |
|:--------|:--------|
| `npm test` | Run tests via `node --test test/` |

## Components

| Component | Path | Description |
|:----------|:-----|:------------|
| utils | `src/` | Core utility functions |
| tests | `test/` | Unit tests for utility functions |
| landing | `landing/` | Static landing page (HTML/CSS/JS) |
| docs | `docs/` | Documentation and plans |

## Constraints
- No external dependencies — pure Node.js standard library
- Tests use Node.js built-in `node:test` and `node:assert/strict`
- CommonJS modules (`require`/`module.exports`)

## Priorities
- Focus: Testing Loop Kit workflows
- Source of truth: GitHub Issues
- Priority order: P0-critical > P1-high > P2-medium > P3-low

## Rules
- Run full test suite before committing
- Do not modify generated files
- Follow existing code style

## Loop Settings

| Setting | Value | Description |
|:--------|:------|:------------|
| Session cap | 10 | Max PRs created per `/loop` run |
| Pending PR limit | 10 | Stop creating PRs if this many await review |
| Max group size | 5 | Max issues per group (auto-splits if larger) |
