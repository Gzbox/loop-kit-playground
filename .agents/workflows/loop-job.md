---
description: Structured issue processing loop — review PRs, pick next issue, classify, implement, submit PR
---

# Loop Job Workflow

Structured issue processing loop for any GitHub project. Execute one iteration per invocation.

> Adapt this workflow to your project. Not every project uses TDD or has the same tooling — follow what your `AGENTS.md` defines.

## Prerequisites

- `gh` CLI authenticated with repo access (run `gh auth status` to verify)
- Project root should have an `AGENTS.md` with build/test commands (recommended but not blocking)
- Priority labels are helpful (`P0-critical` through `P3-low`) — but unlabeled issues are still processed

## Pre-flight Check

// turbo
1. Verify gh authentication:
   ```bash
   gh auth status
   ```
   If not authenticated, stop and report to user.

// turbo
2. Ensure clean working tree:
   ```bash
   git status --porcelain
   ```
   If dirty, stash or commit before proceeding. Report to user if unclear what to do.

---

## Step 1: Process Open PRs

// turbo
1. Check open PRs:
   ```bash
   gh pr list --state open --json number,title,labels,reviewDecision
   ```

2. For each PR:
   - Check CI status: `gh pr checks <N>`
   - If CI fails: view logs, diagnose, fix, and push
   - If merge conflicts: rebase onto main

3. Apply **priority-based code review**:
   - **P0/P1** (bugs, security, logic errors): Must fix before merge
   - **P2** (code quality, naming): Fix if clear and safe; flag to user if uncertain
   - **P3** (style preferences): Note but don't block merge

4. Merge ready PRs:
   ```bash
   gh pr merge <N> --squash --delete-branch
   ```

5. **Clear all PRs before proceeding to Step 2.** If any PR needs user input, report and stop.

---

## Step 2: Select Next Issue

// turbo
1. Sync to latest main:
   ```bash
   git checkout main && git pull
   ```

// turbo
2. List open issues:
   ```bash
   gh issue list --state open --json number,title,labels,body
   ```

// turbo
3. Check for existing PRs to avoid duplicates:
   ```bash
   gh pr list --state open --json number,title,headRefName
   ```

4. Apply selection rules:
   - **Exclude** issues that already have an open PR (match by `issue-<N>` in branch name or PR title)
   - **Sort by priority**: `P0-critical` > `P1-high` > `P2-medium` > `P3-low`
   - **Unlabeled issues**: read the body, assess priority, then slot them in
   - **Within same priority**: prefer smaller, more concrete issues first
   - **Check dependencies**: if the issue body or comments mention dependencies on other issues, verify those are closed first. Skip if prerequisites are open.

5. **Read the full issue body** before deciding approach — issue bodies often contain detailed acceptance criteria in "Suggested improvements" sections.

6. If no actionable issues remain, report to user and stop.

---

## Step 3: Classify & Implement

Read the selected issue body carefully, then classify using this decision flow:

### Classification Decision Flow

```
Issue selected
  │
  ├─ Labeled "skip-human-decision"?
  │  └─ YES → SKIP. Report to user with context.
  │
  ├─ Already has an open PR?
  │  └─ YES → SKIP. Handled in Step 1.
  │
  ├─ Requires a specific platform? (check AGENTS.md "Platform constraints"
  │  and issue labels like "depends-macos", "depends-linux", etc.)
  │  └─ Current env doesn't match → SKIP with comment:
  │     "Skipped: requires <platform> but running on <current>."
  │     Do NOT claim validation that cannot happen on this platform.
  │
  ├─ Labeled "plan-needed" OR issue body says "architecture" / "design decision"?
  │  ├─ Does docs/plans/<topic>.md already exist?
  │  │  ├─ YES → PLAN MODE Round 2+ (implement next sub-task)
  │  │  └─ NO  → PLAN MODE Round 1 (produce design doc only)
  │  └─ Are multiple issues strongly related (shared infrastructure)?
  │     └─ YES → Group them. Plan covers all, implement one per round.
  │
  ├─ Has clear acceptance criteria or concrete scope?
  │  └─ YES → DIRECT IMPLEMENTATION
  │
  └─ No clear scope?
     └─ Read body carefully. Issues often contain detailed suggestions
        that serve as implicit AC. Then choose Direct or Plan.
```

### Direct Implementation

// turbo
1. Create a feature branch:
   ```bash
   git checkout -b issue-<N>-<short-description>
   ```

2. **If the project uses TDD** (check `AGENTS.md`):
   - Write a failing test capturing expected behavior
   - Confirm it fails for the right reason
   - Implement the minimal solution to pass

3. **If no test infrastructure exists**:
   - Implement the change directly
   - Add manual verification steps in the PR description
   - Consider whether this is an opportunity to add basic tests

4. Run the project's verification commands (from `AGENTS.md`):
   - If no commands defined: at minimum ensure the project builds without errors

5. Proceed to Step 4

### Plan Mode — Round 1 (Design Only)

// turbo
1. Create branch:
   ```bash
   git checkout -b plan-<N>-<topic>
   ```

2. Read all related issues, existing code, and any prior plans in `docs/plans/`

3. Produce a design document at `docs/plans/<topic>.md`:
   - Problem statement and context
   - Concrete file changes with type signatures / API shapes
   - Data flow and state ownership
   - Sub-task breakdown with estimated complexity
   - Dependencies between sub-tasks

4. Commit the plan — **do NOT write implementation code in this round**

5. Proceed to Step 4

### Plan Mode — Round 2+ (Implement Sub-task)

1. Read the existing plan from `docs/plans/<topic>.md`
2. Find the next uncompleted sub-task
3. Implement it following the "Direct Implementation" flow above
4. Update the plan to mark the sub-task as done
5. Proceed to Step 4

---

## Step 4: Verify & Submit

1. **Run verification** (defined in `AGENTS.md`):
   - Typical: build, test, lint, type-check
   - If `AGENTS.md` doesn't define commands: do your best (at minimum: build)
   - If full validation isn't possible on current platform: state clearly in PR

2. Commit changes with a descriptive message referencing the issue number

// turbo
3. Push the branch:
   ```bash
   git push -u origin HEAD
   ```

4. Create a PR (agent constructs title and body based on the changes):
   ```bash
   gh pr create --title "<descriptive title>" --body "Closes #<N>

   ## Changes
   - <summary of what changed and why>

   ## Verification
   - <what was tested / validated>
   - <any caveats or pending validation>"
   ```
   If `gh pr create` fails (e.g., template parsing error, permissions), try with `--fill` flag as fallback.
   If it still fails, report the error to the user and stop.

5. **Report to user**: summarize what was done, what issue was addressed, and any follow-up needed.

---

## Step 5: Record Iteration History

After completing (or skipping/stopping), append a summary to `.agents/loop-history.md`:

```markdown
## YYYY-MM-DD HH:MM

**PRs processed**: #5 merged, #8 had CI failure (fixed and merged)
**Issue worked**: #7 (P1-high) — implemented trigger index
**PR created**: #12
**Skipped**: #9 (depends on #7, still open), #18 (needs human decision)
**Notes**: macOS validation pending
```

This gives the next `/loop` invocation context about what happened previously.
If the file doesn't exist yet, create it with a header: `# Loop History`

---

## Quality Rules (always apply)

- Follow `AGENTS.md` constraints strictly — it is the project's constitution
- Run full verification suite before committing (or document why you couldn't)
- Update relevant docs if architecture, workflow, or validation expectations change
- **One issue per iteration** — keep PRs small and focused
- Do not invent priority order — follow labels and `AGENTS.md`
- Do not claim validation that did not actually happen
- When issue body conflicts with labels, trust the issue body

## Flexibility Notes

This workflow adapts to any project:
- **No labels?** Read issue bodies and use your judgment for priority
- **No tests?** Skip TDD steps, implement directly, note in PR
- **No `AGENTS.md`?** Use common sense: build the project, check for obvious errors
- **Plan exists from prior round?** Go straight to Round 2+
- **Issue is trivial (typo, one-line fix)?** Skip classification, just fix and PR
- **Blocked on another issue?** Skip, pick the next one, report the dependency
- **First time running?** No history file is fine — it will be created automatically
- **Platform mismatch?** Skip issues labeled `depends-<platform>` if current env doesn't match. Never claim validation that didn't happen.
