---
description: Multi-repo loop — run /loop across multiple repositories in sequence
---

# Loop Multi Workflow

Run the `/loop` workflow across multiple repositories in sequence. Useful for maintaining a portfolio of projects with a single command.

> This workflow requires that each target repo already has Loop Kit installed (`/loop` workflow present).

## Configuration

Before running, define the target repositories. The agent should look for a config file:

// turbo
1. Check for multi-repo config:
   ```bash
   cat .agents/loop-repos.txt 2>/dev/null || echo "NO_CONFIG"
   ```

   If the file doesn't exist, ask the user which repos to process and create it:
   ```
   # .agents/loop-repos.txt
   # One repo per line, format: owner/repo (or local path)
   Gzbox/project-alpha
   Gzbox/project-beta
   /Users/me/local-project
   ```

## Execution

2. For each repo in the list, execute in order:

   **For GitHub repos (owner/repo format):**
   ```bash
   # Clone to temp if not already local
   WORK_DIR=$(mktemp -d)
   gh repo clone <owner/repo> "$WORK_DIR"
   ```

   **For local paths:**
   ```bash
   WORK_DIR="<local-path>"
   ```

3. Enter the repo directory and verify Loop Kit is installed:
   ```bash
   ls "$WORK_DIR/.agents/workflows/loop-job.md" 2>/dev/null
   ```
   If not installed, skip this repo and note it in the summary.

4. **Execute one `/loop` iteration** for this repo:
   - Follow the full `/loop` workflow (Pre-flight → Step 1-5)
   - Record the result

5. After completing (or skipping) a repo, move to the next one.

## Summary

6. After all repos are processed, report a consolidated summary:

   ```markdown
   ## Multi-Repo Loop Summary — YYYY-MM-DD HH:MM

   | Repo | Status | Issue Worked | PR Created |
   |------|--------|--------------|------------|
   | Gzbox/project-alpha | ✅ Completed | #12 (P1) | #15 |
   | Gzbox/project-beta | ⏭️ No issues | — | — |
   | /Users/me/local-project | ❌ No Loop Kit | — | — |
   ```

7. If any repos were skipped due to missing Loop Kit, suggest installing it:
   ```
   To install Loop Kit in <repo>:
   bash <(curl -sL https://raw.githubusercontent.com/Gzbox/loop-kit/main/install.sh)
   ```

## Quality Rules

- Process repos in the order listed in `loop-repos.txt`
- **One iteration per repo** — do not loop multiple times on the same repo
- If a repo requires user input (e.g., blocked issue), note it and move to the next
- Clean up any temp directories created for GitHub clones
- Do not modify `loop-repos.txt` unless the user asks
