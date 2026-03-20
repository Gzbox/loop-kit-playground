---
description: First-time project setup — AI analyzes your project and generates AGENTS.md + labels / 首次项目配置 — AI 分析你的项目并生成 AGENTS.md + 标签
---

# Loop Init / 初始化配置

One-time setup workflow. The AI analyzes your project and auto-generates everything needed for `/loop` to work.

> Run this once after installing Loop Kit. Re-run anytime to refresh after major project changes.

## What This Does / 这会做什么

1. Verifies `gh` CLI authentication
2. Analyzes your project structure, config files, and README
3. Generates a comprehensive `AGENTS.md` tailored to your project
4. Creates labels on GitHub (priority, classification, component, platform)

---

## Step 1: Verify Prerequisites / 检查前置条件

// turbo
1. Detect default branch name / 检测默认分支名:
   ```bash
   DEFAULT_BRANCH=$(gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name')
   ```

// turbo
2. Check gh authentication / 检查 gh 认证:
   ```bash
   gh auth status
   ```
   If not authenticated, stop and instruct user to run `gh auth login`.

// turbo
2. List project files to understand the structure:
   ```bash
   ls -la
   ```

---

## Step 2: Analyze Project / 分析项目

1. **Read config files** — look for ANY of these (not limited to this list):
   - `package.json`, `go.mod`, `Cargo.toml`, `pom.xml`, `build.gradle`,
     `requirements.txt`, `setup.py`, `pyproject.toml`, `Makefile`,
     `CMakeLists.txt`, `Gemfile`, `composer.json`, `pubspec.yaml`,
     `*.csproj`, `Package.swift`, or any other build/project file.
   - Extract: build commands, test commands, lint commands, language, framework.

2. **Read README.md** (if exists) — extract project description and purpose.

3. **Scan directory structure** — identify components/modules:
   ```bash
   find . -maxdepth 2 -type d -not -path '*/\.*' -not -path '*/node_modules/*' -not -path '*/vendor/*' | head -30
   ```
   Look for meaningful directories like `src/auth/`, `lib/api/`, `pages/dashboard/`, etc.

4. **Read code constraints** — check for:
   - `.eslintrc*`, `tsconfig.json`, `.prettierrc`, `rustfmt.toml`, `.editorconfig`
   - CI config: `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`
   - Extract any relevant rules or constraints.

---

## Step 3: Generate AGENTS.md / 生成 AGENTS.md

If `AGENTS.md` already exists, read it first. Preserve any user customizations and enhance with detected information.

If `AGENTS.md` does not exist, create it with the following structure:

```markdown
# AGENTS.md

## Project Overview
[AI-generated description from README and config files]

## Tech Stack
- Language: [detected]
- Framework: [detected]
- Build tool: [detected]

## Build & Test Commands
[Extracted from config files — these are what /loop uses in Step 4]

| Command | Purpose |
|:--------|:--------|
| `[detected build command]` | Build the project |
| `[detected test command]` | Run tests |
| `[detected lint command]` | Lint/format check |

## Components
[Detected from directory structure — used by /loop for issue grouping]

| Component | Path | Description |
|:----------|:-----|:------------|
| [name] | [path] | [AI-inferred purpose] |

## Constraints
[Extracted from linter configs, tsconfig, etc.]

## Priorities
- Focus: [inferred from README/config]
- Source of truth: GitHub Issues
- Priority order: P0-critical > P1-high > P2-medium > P3-low

## Rules
- Run full test suite before committing
- Do not modify generated files
- Follow existing code style

## Loop Settings
[Adjust these to control /loop behavior — defaults work for most projects]

| Setting | Value | Description |
|:--------|:------|:------------|
| Session cap | 5 | Max PRs created per `/loop` run / 每次 `/loop` 最多创建的 PR 数 |
| Pending PR limit | 10 | Stop creating PRs if this many await review |
| Max group size | 5 | Max issues per group (auto-splits if larger) |
```

Create `docs/plans/` directory for Plan Mode / 为规划模式创建目录:
```bash
mkdir -p docs/plans
```

Commit the generated files / 提交生成的文件:
```bash
git add AGENTS.md docs/plans/ && git commit -m "chore: generate AGENTS.md via /loop-init" && git push || {
  echo "⚠️ Push failed (branch protection?). Creating chore branch... / 推送失败（分支保护？），创建 chore 分支..."
  CHORE_BRANCH="chore/loop-init-$(date +%Y%m%d)"
  git checkout -b "$CHORE_BRANCH"
  git push -u origin HEAD
  echo "Pushed to $CHORE_BRANCH — create a PR to merge. / 已推送到 $CHORE_BRANCH — 请创建 PR 合并。"
}
```

---

## Step 4: Create Labels / 创建标签

// turbo
1. Create priority labels:
   ```bash
   gh label create "P0-critical" --color "B60205" --description "Critical: blocks all progress" --force
   gh label create "P1-high"     --color "D93F0B" --description "High priority: core functionality" --force
   gh label create "P2-medium"   --color "FBCA04" --description "Medium priority: quality improvements" --force
   gh label create "P3-low"      --color "0E8A16" --description "Low priority: polish and nice-to-have" --force
   ```

// turbo
2. Create classification labels:
   ```bash
   gh label create "plan-needed"         --color "5319E7" --description "Requires design plan before implementation" --force
   gh label create "skip-human-decision" --color "D4C5F9" --description "Needs human decision — do not auto-implement" --force
   gh label create "has-dependencies"    --color "E99695" --description "Blocked: depends on other issues being resolved first" --force
   ```

3. Create component labels based on detected components:
   ```bash
   # For each detected component:
   gh label create "component:<name>" --color "1d76db" --description "<component description>" --force
   ```

4. Create platform labels if the project has platform-specific requirements:
   - Check `AGENTS.md`, README, and config files for platform constraints (e.g., iOS-only, requires macOS, Linux-specific)
   - If platform requirements detected, create labels:
     ```bash
     # For each detected platform requirement:
     gh label create "depends-<platform>" --color "006B75" --description "Requires <platform> for validation" --force
     ```
   - Common examples: `depends-macos`, `depends-linux`, `depends-windows`
   - If no platform requirements detected, skip this step

---

## Step 5: Report to User / 向用户报告

Present a summary of what was configured:

```
🎉 Loop Kit initialized!

📝 AGENTS.md generated:
   - Project: [name]
   - Build: [command]
   - Test: [command]
   - Components: [list]

🏷️ Labels created:
   - Priority: P0-critical, P1-high, P2-medium, P3-low
   - Classification: plan-needed, skip-human-decision, has-dependencies
   - Components: component:auth, component:dashboard, ...
   - Platform: depends-macos, ... (if detected)

Next: Create some Issues, then type /loop to start processing.
Please review AGENTS.md and adjust if needed.
```
