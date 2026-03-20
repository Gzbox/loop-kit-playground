---
description: Process a specific issue by number — same discipline as /loop but for one specified issue / 按编号处理指定 Issue — 与 /loop 同样的规范，但只处理一个指定 Issue
---

# Loop Issue Workflow / 指定 Issue 处理工作流

Process a **specific** GitHub issue by number. Follows the same discipline as `/loop`, but targets one issue directly.

## Usage / 用法

```
/loop-issue #5
/loop-issue 5
```

## Pre-flight Check / 预检

Same as `/loop` — see [loop.md](loop.md) Pre-flight Check.

---

## Step 1: Check PRs & Verify Main / 检查 PR 和验证主干

Same as `/loop` — see [loop.md](loop.md) Step 1.
Address review feedback, verify main health. Do NOT merge PRs.

> **Exception**: The pending PR limit rule does NOT apply here. The user explicitly selected this issue — always proceed.

---

## Step 2: Load Specified Issue / 加载指定 Issue

// turbo
1. Sync to latest main:
   ```bash
   git checkout main && git pull
   ```

// turbo
2. Read the specified issue:
   ```bash
   gh issue view <N> --json number,title,labels,body,state
   ```

3. Verify the issue is actionable:
   - **Closed?** → Report to user and stop
   - **Already has an open PR?** → Report and stop
   - **Has `has-dependencies` label?** → Parse `### Depends On` section, check each referenced issue:
     - If any dependency is still open → report which issues are blocking and stop
     - If all dependencies are closed → proceed (issue is unblocked)

4. **Identify related issues** for context:
   ```bash
   gh issue list --state open --json number,title,labels,body --limit 20
   ```
   Scan other open issues — note any that are related (same component, same feature area).
   This context helps you write better code and a more helpful PR.

---

## Step 3: Classify & Implement / 分类并实现

Same decision flow as `/loop` — see [loop.md](loop.md) Step 3.

> **Note**: If the issue is labeled `skip-human-decision` or requires a different platform, explain clearly to the user (they explicitly asked for this issue).

---

## Step 4: Verify & Submit / 验证并提交

Same as `/loop` — see [loop.md](loop.md) Step 4.

**Additional for /loop-issue**: include related issue hints in PR body:
```markdown
> 💡 Related issues in same area: #X, #Y — consider reviewing together
```

Do NOT loop back for more issues — `/loop-issue` processes exactly one issue.

---

## Step 5: Record History / 记录历史

Same format as `/loop` — see [loop.md](loop.md) Step 5.
Note that this issue was **manually selected**:

```markdown
## YYYY-MM-DD HH:MM — Session Summary

### 📋 Your Review Queue
PR: #<M> (<title>) — manually selected via /loop-issue
Related: #X, #Y (same component — consider reviewing together)

### 📊 Stats
PRs created: 1 | Manually selected: #<N>
```
