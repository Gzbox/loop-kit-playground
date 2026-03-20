---
description: Structured issue processing loop — group related issues, implement, submit review-friendly PRs / 结构化 Issue 处理闭环 — 分组相关 Issue，实现需求，提交易读 PR
---

# Loop Job Workflow / 批量处理工作流

Structured issue processing loop for any GitHub project. Processes **all actionable issues** per invocation — grouped by component, one PR per issue, optimized for human review.

> Adapt this workflow to your project. Follow what your `AGENTS.md` defines.

## Prerequisites / 前置条件

- `gh` CLI authenticated with repo access (run `gh auth status` to verify)
- `AGENTS.md` exists (run `/loop-init` to generate it)
- Priority labels are helpful (`P0-critical` through `P3-low`) — but unlabeled issues are still processed

## Pre-flight Check / 预检

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

// turbo
3. Check for Loop Kit updates (non-blocking):
   ```bash
   if [ -f .agents/.loop-kit-version ]; then
     LOCAL_VER=$(cat .agents/.loop-kit-version)
     LATEST_VER=$(gh api repos/Gzbox/loop-kit/releases/latest --jq '.tag_name' 2>/dev/null || echo "")
     if [ -n "$LATEST_VER" ] && [ "$LOCAL_VER" != "$LATEST_VER" ]; then
       echo "💡 Loop Kit update available: $LOCAL_VER → $LATEST_VER"
       echo "   Run: bash <(curl -sL https://raw.githubusercontent.com/Gzbox/loop-kit/main/install.sh) --version $LATEST_VER"
     fi
   fi
   ```
   This is informational only — never block the workflow for version mismatches.

---

## Step 1: Check PRs & Verify Main / 检查 PR 和验证主干

// turbo
1. Sync to latest main:
   ```bash
   git checkout main && git pull
   ```

2. **Verify main health** — run the project's test suite (from `AGENTS.md`):
   - If tests fail → **prioritize fixing main** over new issues.
   - Create a fix branch, fix, submit PR, then report.

// turbo
3. Check open PRs:
   ```bash
   gh pr list --state open --json number,title,labels,reviewDecision,headRefName
   ```

4. **Address review feedback** — for each PR with review comments:
   ```bash
   gh pr view <N> --json comments,reviews
   ```
   - **"Fix this line"** → check out the branch, make the fix, push
   - **"Wrong approach, use X"** → refactor, push
   - **"Don't need this"** → close the PR with comment
   - **No review yet** → skip, report "awaiting review"
   - **Stale PR** (open > 3 days, no review) → rebase onto main

   Process review feedback by priority: P0 PRs first.

5. **Pending PR check** — count open PRs awaiting review:
   - Read `Pending PR limit` from `AGENTS.md` Loop Settings (default: 10)
   - If pending PRs ≥ limit → do NOT create new PRs. Report:
     "You have N PRs awaiting review. Please review them before running /loop again."
   - Proceed to Step 5 (Record Session History) and stop.

6. **Report PR status** — do NOT merge. Merging is the human's responsibility.

---

## Step 2: Scan & Auto-Group / 扫描并自动分组

// turbo
1. List open issues:
   ```bash
   gh issue list --state open --json number,title,labels,body --limit 50
   ```

// turbo
2. Check for existing PRs to avoid duplicates:
   ```bash
   gh pr list --state open --json number,title,headRefName
   ```

3. **Filter actionable issues**:
   - Exclude issues with open PRs (match by `issue-<N>` in branch name or PR title)
   - Exclude `skip-human-decision` labeled issues
   - Exclude issues with unmet dependencies:
     - If issue has `has-dependencies` label → parse body for `### Depends On` section
     - Extract referenced issue numbers (`#N`)
     - Check each: `gh issue view <N> --json state --jq '.state'`
     - If **any** dependency is still `OPEN` → skip, report: "Blocked by #N (still open)"
     - If **all** dependencies are `CLOSED` → proceed (issue is unblocked)
   - Read the full body of each issue

4. **Auto-group** (skip if ≤ 2 actionable issues):
   - If issues have `component:xxx` labels → group by label
   - Otherwise → read titles and bodies, identify related issues (same module, same feature area, same page)
   - Unrelated issues → `standalone` group
   - **Max group size** from `AGENTS.md` Loop Settings (default: 5) — split into sub-groups if larger (e.g., `auth-1`, `auth-2`)

5. **Order groups by priority** (highest-priority issue in each group determines group priority):
   - `P0-critical` > `P1-high` > `P2-medium` > `P3-low`
   - Within each group, order issues by priority
   - Unlabeled issues: read body, assess priority

6. If no actionable issues remain, report to user and proceed to Step 5.

---

## Step 3: Classify & Implement / 分类并实现

Read the selected issue body carefully, then classify:

### Classification Decision Flow / 分类决策流程

```
Issue selected
  │
  ├─ Labeled "skip-human-decision"?
  │  └─ YES → SKIP. Report to user with context.
  │
  ├─ Labeled "has-dependencies"? (defense-in-depth — also filtered in Step 2)
  │  └─ Any dependency still open? → SKIP. Report: "Blocked by #N (still open)".
  │
  ├─ Already has an open PR?
  │  └─ YES → SKIP. Handled in Step 1.
  │
  ├─ Requires a specific platform? (check AGENTS.md and labels like "depends-macos")
  │  └─ Current env doesn't match → SKIP with comment.
  │     Do NOT claim validation that cannot happen on this platform.
  │
  ├─ Labeled "plan-needed" OR involves architecture/design?
  │  ├─ docs/plans/<topic>.md exists?
  │  │  ├─ YES → PLAN MODE Round 2+ (implement next sub-task)
  │  │  └─ NO  → PLAN MODE Round 1 (produce design doc only)
  │  └─ Multiple issues in same group share infrastructure?
  │     └─ YES → Group plan covers all, implement one per round.
  │
  ├─ Clear acceptance criteria?
  │  └─ YES → DIRECT IMPLEMENTATION
  │
  └─ No clear scope?
     └─ Read body carefully, then choose Direct or Plan.
```

### Direct Implementation / 直接实现

// turbo
1. Create a feature branch:
   ```bash
   git checkout -b issue-<N>-<short-description>
   ```

2. **Determine testability** (see decision table):

   | Issue Type | Approach |
   |:-----------|:---------|
   | Bug fix / feature with Done When | Test-first ✅ |
   | Refactoring (no behavior change) | Run existing tests before & after |
   | UI/visual changes | Note in What I Did NOT Test |
   | Documentation only | No tests needed |
   | Trivial fix (typo, one-line) | Existing tests sufficient |

3. **Test-first flow** (when applicable):
   - Read issue "Done When" checklist — each item becomes a test
   - **Write tests FIRST** — one test per Done When item
   - **Run tests → confirm FAIL** (proves they target unimplemented behavior)
   - If tests PASS before implementation → tests are wrong, rewrite them
   - **Implement the fix/feature**
   - **Run tests → confirm PASS**
   - Run full test suite → no regressions

4. Run the project's verification commands (from `AGENTS.md`).

5. Proceed to Step 4.

### Plan Mode — Round 1 (Design Only) / 规划模式 — 第 1 轮（仅设计）

// turbo
1. Create branch:
   ```bash
   git checkout -b plan-<N>-<topic>
   ```
2. Produce `docs/plans/<topic>.md` — problem, changes, sub-tasks, dependencies.
3. Commit plan only — no implementation code.
4. Proceed to Step 4.

### Plan Mode — Round 2+ (Implement Sub-task) / 规划模式 — 第 2+ 轮（实现子任务）

1. Read existing plan, find next uncompleted sub-task.
2. Implement following Direct Implementation flow.
3. Update plan to mark sub-task done.
4. Proceed to Step 4.

---

## Step 4: Verify & Submit / 验证并提交

1. **Run verification** (from `AGENTS.md`): build, test, lint, type-check.

2. Commit with descriptive message referencing issue number.

// turbo
3. Push:
   ```bash
   git push -u origin HEAD
   ```

4. **Create a review-friendly PR**:

   ```bash
   gh pr create --title "<descriptive title>" --body "<see PR body template below>"
   ```

   **PR body template** — optimize for human review:

   ```markdown
   ## Closes #<N>

   **Group: <component>** (<position>/<total> — see also PR #X, #Y)
   **Merge after**: PR #X (or "— first in group")

   ## Why
   <Explain motivation — WHY this change is needed, not what changed>

   ## What Changed
   - `file.ts` — <what and why>

   ## Acceptance Criteria
   From issue "Done When":
   - [x] <criterion 1> — `file.ts:12` <how it was met>
   - [x] <criterion 2> — `other.ts:45-50` <how it was met>
   - [ ] ⚠️ <criterion 3> — not verified: <reason>

   > If the issue has no "Done When", infer acceptance criteria from the issue body.

   ## Key Review Points
   > Focus your review on these lines:
   > - `file.ts:45-52` — <core logic change>
   > - `other.ts:30` — <type change>

   ## Test Evidence
   New tests: `auth.test.ts` (2 tests for #<N>)

   Before (tests fail — proving they target the right behavior):
       FAIL  ✕ wrong password → shows error
             ✕ empty input → button disabled
       Tests: 2 failed

   After (tests pass):
       PASS  ✓ wrong password → shows error (5ms)
             ✓ empty input → button disabled (3ms)
       Full suite: 16 passed, 0 failed

   > Show only NEW tests' before/after output, not the full suite log.
   > If existing tests cover the change: "Covered by N existing tests — all pass"
   > If no test framework: omit this section, explain in What I Did NOT Test.

   ## What I Did NOT Test
   - <thing not tested> — <why>
   - <platform/environment limitation>

   > Never omit this section. If everything was tested, write "None".

   ## After This Group Is Merged
   <Only on the LAST PR in a group>
   Test: <what to verify after merging all group PRs>
   ```

   If no group (standalone issue), omit Group/Merge after lines.
   If `gh pr create` fails, try `--fill` as fallback.

5. **Add labels to PR**:
   ```bash
   gh label create "component:<name>" --color "1d76db" --force 2>/dev/null
   gh pr edit <N> --add-label "component:<name>"
   ```

6. **Loop check** — are there more actionable issues?
   - Read `Session cap` from `AGENTS.md` Loop Settings (default: 10)
   - **Below cap + more issues** → `git checkout main && git pull`, return to Step 2 (pick next issue, same group first)
   - **No more issues** → Proceed to Step 5
   - **Session cap reached** → Proceed to Step 5, note remaining issues

---

## Step 5: Record Session History / 记录会话历史

After processing all issues (or stopping), append to `.agents/loop-history.md`:

```markdown
## YYYY-MM-DD HH:MM — Session Summary

### 📋 Your Review Queue

#### Group: <component> (<N> PRs, <priority>)
Issues: #X, #Y, #Z
PRs: #A, #B, #C
Merge order: #A → #B → #C
After merge, test: <what to verify>

#### Standalone (<N> PRs)
PR: #D (<title>)

### ⏭️ Skipped
- #X (depends on #Y)
- #Z (needs human decision)

### 📊 Stats
PRs created: N | Review feedback addressed: N | Remaining issues: N
```

If the file doesn't exist, create it with header: `# Loop History`

---

## Quality Rules (always apply) / 质量规则（始终适用）

- Follow `AGENTS.md` constraints strictly — it is the project's constitution
- Run full verification suite before committing
- **One PR per issue** — keep PRs small and focused
- **Key Review Points in every PR** — tell the human where to focus
- **Acceptance Criteria in every PR** — map each "Done When" item to specific code changes
- **Test Evidence in every code PR** — show red→green test output as proof
- **What I Did NOT Test in every PR** — be honest about testing gaps; never omit this section
- Do not invent priority order — follow labels and `AGENTS.md`
- Do not claim validation that did not actually happen
- When issue body conflicts with labels, trust the issue body

## Flexibility Notes / 灵活性说明

- **No labels?** Read issue bodies and use your judgment
- **No tests?** Implement directly, explain in What I Did NOT Test
- **No `AGENTS.md`?** Run `/loop-init` first; or use common sense
- **Plan exists from prior round?** Go straight to Round 2+
- **Trivial issue (typo, one-line fix)?** Skip classification, just fix and PR
- **Blocked on another issue?** Skip, pick next, report dependency
- **First time running?** No history file is fine — created automatically
- **Platform mismatch?** Skip `depends-<platform>` issues. Never claim false validation.
- **Only 1-2 issues?** Skip grouping, process directly by priority
- **Same-group PRs touch same file?** Note in PR: `⚠️ May conflict with PR #X — merge #X first`
- **No "Done When" in issue?** Infer acceptance criteria from the issue body and label them as inferred
- **Plan Mode Round 1 (design only)?** Omit Acceptance Criteria, Test Evidence, and What I Did NOT Test
