---
description: Quick read-only dashboard — view PRs grouped by component, issue counts, and blocked issues / 快速只读仪表盘 — 查看按组件分组的 PR、Issue 数量和被阻塞的 Issue
---

# Loop Status / 状态仪表盘

Read-only dashboard for the current project. Shows what's pending, grouped for easy scanning.

// turbo
1. Check open PRs (with CI and review status) / 检查待处理 PR:
   ```bash
   gh pr list --state open --json number,title,author,createdAt,labels,reviewDecision,statusCheckRollup --template '{{range .}}#{{.number}} {{.title}} ({{.author.login}}, {{timeago .createdAt}}) [review: {{.reviewDecision}}]{{"\\n"}}{{end}}'
   ```

2. **Group PRs by component label** and report / 按组件标签分组 PR 并报告:
   - Read `component:xxx` labels on each PR
   - Display PRs grouped by component
   - For each group: show CI status, review status, suggested merge order
   - Highlight **PRs ready for review** (CI passes, no conflicts)

   Example output:
   ```
   === PRs Awaiting Your Review ===

   Group: auth (3 PRs)
     #10 Fix login crash         CI ✅  ready for review
     #11 Token refresh fix       CI ✅  ready for review
     #12 Session expiry          CI ✅  ready for review
     → Review together, merge: #10 → #11 → #12

   Group: dashboard (2 PRs)
     #13 Chart rendering fix     CI ✅  ready for review
     #14 Filter fix              CI ⏳  running
     → Wait for #14 CI, then review together

   Standalone:
     #15 Update README           CI ✅  ready for review
   ```

// turbo
3a. P0-critical issues:
    ```bash
    echo "=== P0-critical ===" && gh issue list --state open --label P0-critical --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\\n"}}{{end}}'
    ```

// turbo
3b. P1-high issues:
    ```bash
    echo "=== P1-high ===" && gh issue list --state open --label P1-high --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\\n"}}{{end}}'
    ```

// turbo
3c. P2-medium issues:
    ```bash
    echo "=== P2-medium ===" && gh issue list --state open --label P2-medium --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\\n"}}{{end}}'
    ```

// turbo
3d. P3-low issues:
    ```bash
    echo "=== P3-low ===" && gh issue list --state open --label P3-low --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\\n"}}{{end}}'
    ```

// turbo
3e. Unlabeled issues:
    ```bash
    echo "=== Unlabeled ===" && gh issue list --state open --json number,title,labels --template '{{range .}}{{if eq (len .labels) 0}}  #{{.number}} {{.title}}{{"\\n"}}{{end}}{{end}}'
    ```

// turbo
4a. Issues needing human decision / 需要人工决策的 Issue:
    ```bash
    echo "=== Needs Human Decision ===" && gh issue list --state open --label skip-human-decision --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\\n"}}{{end}}'
    ```

// turbo
4b. Issues needing plan / 需要规划的 Issue:
    ```bash
    echo "=== Needs Plan ===" && gh issue list --state open --label plan-needed --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\\n"}}{{end}}'
    ```

// turbo
4c. Blocked issues / 被阻塞的 Issue:
    ```bash
    echo "=== Blocked by Dependencies ===" && gh issue list --state open --label has-dependencies --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\\n"}}{{end}}'
    ```

// turbo
5. Check recent loop history (if exists) / 检查最近的循环历史:
   ```bash
   if [ -f .agents/loop-history.md ]; then echo "=== Last Session ===" && tail -30 .agents/loop-history.md; else echo "No loop history yet — run /loop to start. / 暂无循环历史 — 运行 /loop 开始。"; fi
   ```

6. Report a summary to the user / 向用户报告摘要:
   - **PRs ready for you to review** (grouped by component) / 待审核的 PR（按组件分组）
   - PRs that need attention (CI failing, conflicts, stale) / 需要关注的 PR
   - Issue counts per priority level / 各优先级的 Issue 数量
   - Which issues are blocked and why / 哪些 Issue 被阻塞及原因
   - Suggested next action (e.g., "Review auth group PRs, then run /loop") / 建议的下一步操作
