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
1. Detect default branch name / 检测默认分支名:
   ```bash
   DEFAULT_BRANCH=$(gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name')
   ```
   Use `$DEFAULT_BRANCH` everywhere instead of hardcoding `main`.

// turbo
2. Verify gh authentication / 验证 gh 认证:
   ```bash
   gh auth status
   ```
   If not authenticated, stop and report to user.

// turbo
3. Ensure clean working tree / 确保工作树干净:
   ```bash
   git status --porcelain
   ```
   If dirty, stash or commit before proceeding. Report to user if unclear what to do.

// turbo
4. Check for Loop Kit updates (non-blocking) / 检查 Loop Kit 更新（非阻塞）:
   ```bash
   if [ -f .agents/.loop-kit-version ]; then
     LOCAL_VER=$(cat .agents/.loop-kit-version)
     LATEST_VER=$(gh api repos/Gzbox/loop-kit/releases/latest --jq '.tag_name' 2>/dev/null || echo "")
     if [ -n "$LATEST_VER" ] && [ "$LOCAL_VER" != "$LATEST_VER" ]; then
       if [ "$LOCAL_VER" = "main" ]; then
         echo "💡 Consider pinning to latest release: --version $LATEST_VER / 建议锁定最新版本"
       else
         echo "💡 Loop Kit update available / 有可用更新: $LOCAL_VER → $LATEST_VER"
       fi
       echo "   Run: bash <(curl -sL https://raw.githubusercontent.com/Gzbox/loop-kit/main/install.sh) --version $LATEST_VER"
     fi
   fi
   ```
   This is informational only — never block the workflow for version mismatches.

// turbo
5. Read session history (if exists) / 读取会话历史（如存在）:
   ```bash
   if [ -f .agents/loop-history.md ]; then cat .agents/loop-history.md; fi
   ```
   Use this context to avoid re-analyzing skipped issues and understand prior decisions.

// turbo
6. Check AGENTS.md freshness (non-blocking) / 检查 AGENTS.md 时效性（非阻塞）:
   ```bash
   if [ -f AGENTS.md ]; then
     AGENTS_AGE=$(( ($(date +%s) - $(stat -f %m AGENTS.md 2>/dev/null || stat -c %Y AGENTS.md 2>/dev/null || echo 0)) / 86400 ))
     if [ "$AGENTS_AGE" -gt 90 ]; then
       echo "💡 AGENTS.md is $AGENTS_AGE days old. Consider running /loop-init to refresh."
       echo "💡 AGENTS.md 已有 $AGENTS_AGE 天未更新。建议运行 /loop-init 刷新。"
     fi
   fi
   ```

---

## Step 1: Check PRs & Verify Main / 检查 PR 和验证主干

// turbo
1. Sync to latest default branch / 同步到最新默认分支:
   ```bash
   git checkout "$DEFAULT_BRANCH" && git pull || {
     echo "⚠️ Merge conflict on $DEFAULT_BRANCH. Resolve manually before running /loop."
     echo "⚠️ $DEFAULT_BRANCH 上存在合并冲突。请手动解决后再运行 /loop。"
     exit 1
   }
   ```

2. **Verify main health** — run the project's **full verification suite** (from `AGENTS.md`: build, test, lint, type-check):
   - If any check fails → **prioritize fixing the default branch** over new issues.
   - Create a fix branch, fix, submit PR, then report.

// turbo
3. Check open PRs / 检查待处理 PR:
   ```bash
   gh pr list --state open --json number,title,labels,reviewDecision,headRefName
   ```

4. **Address review feedback** — for each **code PR** with review comments:
   ```bash
   gh pr view <N> --json comments,reviews
   ```
   - **"Fix this line"** → check out the branch, make the fix, push
   - **"Wrong approach, use X"** → refactor, push
   - **"Don't need this"** → close the PR with comment
   - **No review yet** → skip, report "awaiting review"
   - **Stale PR** (open > 3 days, no review) → rebase onto default branch

   Process review feedback by priority: P0 PRs first.

4b. **For plan PRs** (branch name starts with `plan-`, PR only contains `docs/plans/`) / 处理设计方案 PR:
    ```bash
    gh pr view <N> --json comments,reviews,reviewDecision
    ```
    - `reviewDecision: CHANGES_REQUESTED` →
      Read review comments (these are conceptual, not line-level).
      Check out the plan branch.
      Revise `docs/plans/<topic>.md` based on ALL feedback.
      Reply to each review comment explaining the change. Push.
    - `reviewDecision: APPROVED` →
      Report: "Plan PR #\<N\> approved — awaiting human merge / 设计方案 PR #\<N\> 已通过审核 — 等待人工合并"
    - No review yet → Report: "Plan PR #\<N\> awaiting review / 设计方案 PR #\<N\> 等待审核"

5. **Pending PR check** — count open PRs awaiting review:
   - Read `Pending PR limit` from `AGENTS.md` Loop Settings (default: 10)
   - If pending PRs ≥ limit → do NOT create new PRs. Report:
     "You have N PRs awaiting review. Please review them before running /loop again."
   - Proceed to Step 5 (Record Session History) and stop.

6. **Report PR status** — do NOT merge. Merging is the human's responsibility.

// turbo
7. **Clean up merged branches / 清理已合并分支**:
   ```bash
   git fetch --prune
   git branch --merged "$DEFAULT_BRANCH" | grep -v "^\*\|$DEFAULT_BRANCH" | xargs -r git branch -d
   ```

---

## Step 2: Scan & Auto-Group / 扫描并自动分组

> Maintain an in-memory set of issue numbers processed in this session. When looping back from Step 4, exclude these from actionable issues regardless of API results. / 在内存中维护本次 session 已处理的 issue 编号集合。从 Step 4 循环返回时，无论 API 结果如何，都排除这些 issue。

// turbo
1. List open issues / 列出待处理 Issue:
   ```bash
   gh issue list --state open --json number,title,labels,body --limit 100
   ```

// turbo
2. Check for existing PRs to avoid duplicates / 检查已有 PR 避免重复:
   ```bash
   gh pr list --state open --json number,title,headRefName,body
   ```

3. **Filter actionable issues / 过滤可操作 Issue**:
   - Exclude issues with open PRs (match by `issue-<N>` or `plan-<N>` in branch name, or `#<N>` in PR title/body)
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

6. If no actionable issues remain / 如果没有可操作的 Issue:
   - Check `docs/plans/` for files with unchecked sub-tasks (`- [ ]`).
     If found, report: "No open issues, but plan `docs/plans/<topic>.md` has N unimplemented sub-tasks. The original issue may need to be reopened or new issues created. / 没有待处理 Issue，但计划文件有 N 个未实现的子任务。"
   - Report to user and proceed to Step 5.

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
  │  ├─ docs/plans/<topic>.md exists ON DEFAULT BRANCH?
  │  │  ├─ YES → any unchecked sub-tasks ("- [ ]")?
  │  │  │  ├─ YES → PLAN MODE Round 2+ (implement next sub-task)
  │  │  │  └─ NO  → All sub-tasks done. Add comment to close issue if still open.
  │  │  └─ NO  → has open plan PR (branch starts with plan-<N>)?
  │  │     ├─ YES → SKIP (plan awaiting review/merge — handled in Step 1)
  │  │     └─ NO  → PLAN MODE Round 1 (produce design doc only)
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
1. Create a feature branch / 创建功能分支:
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
1. Create branch / 创建分支:
   ```bash
   git checkout -b plan-<N>-<topic>
   ```
2. Create `docs/plans/` directory if it doesn't exist / 创建目录（如不存在）:
   ```bash
   mkdir -p docs/plans
   ```
3. Produce `docs/plans/<topic>.md` using the **Plan File Format / 计划文件格式**:
   ```markdown
   # Plan: <topic>

   ## Problem / 问题
   <goal, context, motivation>

   ## Proposed Approach / 方案
   <architecture, design decisions, technology choices>

   ## Sub-tasks / 子任务
   > Implementation order. Each becomes a separate PR.
   > 实现顺序。每个子任务将成为一个独立的 PR。
   - [ ] 1. <sub-task> — <scope, files affected>
   - [ ] 2. <sub-task> — <scope, files affected>
   - [ ] 3. <sub-task> — <scope, files affected>

   ## Dependencies / 依赖
   <which sub-tasks depend on which, external dependencies>

   ## Open Questions / 待确认
   <things to resolve during review>
   ```
4. Commit plan only — no implementation code. / 仅提交计划，不提交实现代码。
5. Proceed to Step 4. **Use Plan PR body template** (not code PR template).

### Plan Mode — Round 2+ (Implement Sub-task) / 规划模式 — 第 2+ 轮（实现子任务）

1. Read `docs/plans/<topic>.md` from the default branch. If sub-tasks have been added, removed, or reordered since the plan PR was merged, follow the current file state as the source of truth. / 从默认分支读取计划文件。如果子任务已被人工修改，以当前文件为准。
2. Find next unchecked sub-task (`- [ ]`).
3. Create branch: `git checkout -b issue-<N>-subtask-<M>-<description>`
4. Implement following Direct Implementation flow.
5. Update `docs/plans/<topic>.md`: mark completed sub-task `- [x]` with PR number.
6. Proceed to Step 4. **Use Sub-task PR body template**.
   - If this is the LAST sub-task (no more `- [ ]`), use `Closes #<N>` in PR body.
   - Otherwise use `Progress on #<N>`.

---

## Step 4: Verify & Submit / 验证并提交

1. **Run verification** (from `AGENTS.md`): build, test, lint, type-check.

2. Commit with descriptive message referencing issue number.

// turbo
3. Push / 推送:
   ```bash
   git push -u origin HEAD
   ```

4. **Create a review-friendly PR / 创建易读 PR**:
   Write the PR body to a temporary file (use unique name to avoid collision), then create:
   ```bash
   BODY_FILE=$(mktemp /tmp/loop-kit-pr-XXXXXX.md)
   cat > "$BODY_FILE" << 'PRBODY'
   <see PR body template below>
   PRBODY
   gh pr create --title "<descriptive title>" --body-file "$BODY_FILE"
   rm -f "$BODY_FILE"
   ```

   Choose the appropriate PR body template:

   **a. Code PR body template / 代码 PR 模板** (for Direct Implementation):

   ```markdown
   ## Closes #<N>

   **Group: <component>** (<position>/<total>)
   **Merge after**: PR #X (or "— first in group")

   ## Why / 为什么
   <Explain motivation — WHY this change is needed, not what changed>

   ## What Changed / 变更内容
   - `file.ts` — <what and why>

   ## Acceptance Criteria / 验收标准
   From issue "Done When":
   - [x] <criterion 1> — `file.ts:12` <how it was met>
   - [x] <criterion 2> — `other.ts:45-50` <how it was met>
   - [ ] ⚠️ <criterion 3> — not verified: <reason>

   > If the issue has no "Done When", infer acceptance criteria from the issue body.

   ## Key Review Points / 重点审查
   > Focus your review on these lines:
   > - `file.ts:45-52` — <core logic change>
   > - `other.ts:30` — <type change>

   ## Test Evidence / 测试证据
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

   ## What I Did NOT Test / 未测试内容
   - <thing not tested> — <why>
   - <platform/environment limitation>

   > Never omit this section. If everything was tested, write "None".

   ## After This Group Is Merged / 本组合并后
   <Only on the LAST PR in a group>
   Test: <what to verify after merging all group PRs>
   ```

   **b. Plan PR body template / 设计方案 PR 模板** (for Plan Mode Round 1):

   ```markdown
   ## Relates to #<N>

   > ⚡ **This is a design plan, not a code change. / 这是设计方案，不是代码变更。**
   > Use GitHub's **Request Changes** or **Approve** to review.
   > 使用 GitHub 的 **Request Changes** 或 **Approve** 来审核。

   ## Plan: <topic>

   ### Problem / 问题
   <goal and context>

   ### Proposed Approach / 方案
   <architecture / design decisions>

   ### Sub-tasks (Implementation Order) / 子任务（实现顺序）
   - [ ] 1. <sub-task> — <one-line scope>
   - [ ] 2. <sub-task> — <one-line scope>

   ### Dependencies / 依赖
   <which sub-tasks depend on which>

   ---
   > **For Reviewer / 审核者须知**:
   > - Use **Request Changes** to ask for modifications / 使用 **Request Changes** 请求修改
   > - Use **Approve** when the plan looks good / 方案满意后点 **Approve**
   > - Each sub-task → separate PR. Issue #<N> stays open until all done.
   > - 每个子任务将产生独立 PR。Issue #<N> 在全部完成前保持 open。
   ```

   **c. Sub-task PR body template / 子任务 PR 模板** (for Plan Mode Round 2+):

   ```markdown
   ## Progress on #<N> — Sub-task <M>/<total>
   (or: ## Closes #<N> — Final sub-task <M>/<M>)

   Plan: `docs/plans/<topic>.md`

   ### Sub-task: <description>

   ## Why / 为什么
   <motivation for this specific sub-task>

   ## What Changed / 变更内容
   - `file.ts` — <what and why>

   ## Plan Progress / 计划进度
   - [x] 1. <done> (PR #A)
   - [x] 2. <this PR>
   - [ ] 3. <upcoming>

   ## Acceptance Criteria / 验收标准
   ...

   ## Test Evidence / 测试证据
   ...

   ## What I Did NOT Test / 未测试内容
   ...
   ```

   If no group (standalone issue), omit Group/Merge after lines.
   If `gh pr create` fails, try `--fill` as fallback.

5. **Add labels to PR / 为 PR 添加标签**:
   Prefer component names from AGENTS.md Components table. / 优先使用 AGENTS.md 中定义的组件名称。
   ```bash
   gh label create "component:<name>" --color "1d76db" --force 2>/dev/null
   gh pr edit <N> --add-label "component:<name>"
   ```
   If creating a new component label not in AGENTS.md, note it in the session history. / 如果创建了 AGENTS.md 中没有的新组件标签，在会话历史中记录。

6. **Loop check / 循环检查** — are there more actionable issues?
   - Read `Session cap` from `AGENTS.md` Loop Settings (default: 5)
   - **Below cap + more issues** → `git checkout "$DEFAULT_BRANCH" && git pull`, return to Step 2 (pick next issue, same group first)
   - **No more issues** → Proceed to Step 5
   - **Session cap reached** → Proceed to Step 5, note remaining issues

6b. **Group finalization / 分组收尾** — when moving to a different group or finishing all issues:
    For each PR created in the just-completed group, backfill cross-references:
    ```bash
    # For each PR in the group, update body to add sibling PR numbers:
    gh pr view <N> --json body --jq '.body' > /tmp/pr-body-edit.md
    # Add "see also PR #A, #B" to the group line, then:
    gh pr edit <N> --body-file /tmp/pr-body-edit.md
    ```
    Also compare file lists of all PRs in the group. If two PRs modify the same file, add `⚠️ May conflict with PR #X — merge #X first` to both PR bodies.

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

**Commit history / 提交历史记录** — choose based on context:
- **If on a feature branch** (just created a PR): commit to current branch alongside the code changes.
- **If on the default branch**: attempt to commit and push.
  If push fails (e.g., branch protection), create a `chore/loop-history-<date>` branch, commit there, and push. Do NOT block on this — history recording is best-effort. / 如果 push 失败（如分支保护），创建 `chore/loop-history-<date>` 分支提交。这是尽力而为的操作，不应阻塞流程。
- **If no PRs were created this session**: skip committing (no changes to record beyond the history file).

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
- If any verification command (build, test, lint) does not return within 5 minutes, terminate it and report to user. / 如果任何验证命令超过 5 分钟未返回，终止并报告用户。

## Flexibility Notes / 灵活性说明

- **No labels?** Read issue bodies and use your judgment
- **No tests?** Implement directly, explain in What I Did NOT Test
- **No `AGENTS.md`?** Run `/loop-init` first; or use common sense
- **Plan exists from prior round?** Check `docs/plans/<topic>.md` for unchecked sub-tasks → Round 2+
- **Trivial issue (typo, one-line fix)?** Skip classification, just fix and PR
- **Blocked on another issue?** Skip, pick next, report dependency
- **First time running?** No history file is fine — created automatically
- **Platform mismatch?** Skip `depends-<platform>` issues. Never claim false validation.
- **Only 1-2 issues?** Skip grouping, process directly by priority
- **Same-group PRs touch same file?** Detected automatically in group finalization (Step 4.6b)
- **No "Done When" in issue?** Infer acceptance criteria from the issue body and label them as inferred
- **Plan Mode Round 1 (design only)?** Use the Plan PR body template. Omit Code PR sections.
- **Concurrent runs?** `/loop` does not support parallel execution. Do not run multiple `/loop` sessions or `/loop` + `/loop-issue` simultaneously. / `/loop` 不支持并行运行。
- **Session interrupted?** On next `/loop`, orphaned branches (pushed but no PR) will be detected in Step 1. The agent can create the missing PR or clean up. / 下次 `/loop` 时会在 Step 1 检测到孤立分支。
- **Wrong code pushed?** Close the PR, delete the remote branch: `gh pr close <N> && git push origin --delete <branch>`. The issue remains open for the next `/loop` run. / 关闭 PR 并删除远程分支，issue 保持 open。
