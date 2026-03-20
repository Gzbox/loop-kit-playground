---
description: Quick read-only dashboard — view PRs grouped by component, issue counts, and blocked issues / 快速只读仪表盘 — 查看按组件分组的 PR、Issue 数量和被阻塞的 Issue
---

# Loop Status / 状态仪表盘

Read-only dashboard for the current project. Shows what's pending, grouped for easy scanning.

// turbo
1. Check open PRs (with CI and review status):
   ```bash
   gh pr list --state open --json number,title,author,createdAt,labels,reviewDecision,statusCheckRollup --template '{{range .}}#{{.number}} {{.title}} ({{.author.login}}, {{timeago .createdAt}}) [review: {{.reviewDecision}}]{{"\n"}}{{end}}'
   ```

2. **Group PRs by component label** and report:
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
3. Issue summary by priority:
   ```bash
   echo "=== P0-critical ===" && gh issue list --state open --label P0-critical --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}' && echo "=== P1-high ===" && gh issue list --state open --label P1-high --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}' && echo "=== P2-medium ===" && gh issue list --state open --label P2-medium --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}' && echo "=== P3-low ===" && gh issue list --state open --label P3-low --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}' && echo "=== Unlabeled ===" && gh issue list --state open --json number,title,labels --template '{{range .}}{{if eq (len .labels) 0}}  #{{.number}} {{.title}}{{"\n"}}{{end}}{{end}}'
   ```

// turbo
4. Check for blocked issues:
   ```bash
   echo "=== Needs Human Decision ===" && gh issue list --state open --label skip-human-decision --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}' && echo "=== Needs Plan ===" && gh issue list --state open --label plan-needed --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}' && echo "=== Blocked by Dependencies ===" && gh issue list --state open --label has-dependencies --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}'
   ```

// turbo
5. Check recent loop history (if exists):
   ```bash
   if [ -f .agents/loop-history.md ]; then echo "=== Last Session ===" && tail -30 .agents/loop-history.md; else echo "No loop history yet — run /loop to start."; fi
   ```

6. Report a summary to the user:
   - **PRs ready for you to review** (grouped by component)
   - PRs that need attention (CI failing, conflicts, stale)
   - Issue counts per priority level
   - Which issues are blocked and why
   - Suggested next action (e.g., "Review auth group PRs, then run /loop")
