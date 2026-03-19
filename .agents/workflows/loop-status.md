---
description: Quick read-only dashboard — view open PRs, issue counts by priority, and blocked issues
---

# Loop Status

Read-only dashboard for the current project. Shows what's pending without making any changes.

// turbo
1. Check open PRs:
   ```bash
   gh pr list --state open --json number,title,author,createdAt,labels,reviewDecision --template '{{range .}}#{{.number}} {{.title}} ({{.author.login}}, {{timeago .createdAt}}){{"\n"}}{{end}}'
   ```

// turbo
2. Issue summary by priority:
   ```bash
   echo "=== P0-critical ===" && gh issue list --state open --label P0-critical --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}' && echo "=== P1-high ===" && gh issue list --state open --label P1-high --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}' && echo "=== P2-medium ===" && gh issue list --state open --label P2-medium --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}' && echo "=== P3-low ===" && gh issue list --state open --label P3-low --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}' && echo "=== Unlabeled ===" && gh issue list --state open --json number,title,labels --template '{{range .}}{{if eq (len .labels) 0}}  #{{.number}} {{.title}}{{"
"}}{{end}}{{end}}'
   ```

// turbo
3. Check for blocked issues (those with `skip-human-decision` or `plan-needed` labels):
   ```bash
   echo "=== Needs Human Decision ===" && gh issue list --state open --label skip-human-decision --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}' && echo "=== Needs Plan ===" && gh issue list --state open --label plan-needed --json number,title --template '{{range .}}  #{{.number}} {{.title}}{{"\n"}}{{end}}'
   ```

// turbo
4. Check recent loop history (if exists):
   ```bash
   if [ -f .agents/loop-history.md ]; then echo "=== Last 3 iterations ===" && tail -30 .agents/loop-history.md; else echo "No loop history yet"; fi
   ```

5. Report a summary to the user:
   - Total open PRs and their status
   - Issue counts per priority level
   - Which issues are blocked and why
   - Suggested next action (e.g., "Run /loop to process #7 (P0-critical)")
