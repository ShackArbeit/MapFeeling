# CLI Usage Guide｜Claude Code + Codex for TasteMap Date

This file explains how to use the prompt pack with CLI tools.

---

## Recommended Environment

Because the user is on Windows, the safest setup is:

```txt
Windows + WSL2 + Node.js 22 + npm
```

This avoids many path and shell issues for both Claude Code and Codex.

---

## Claude Code CLI

Install:

```bash
npm install -g @anthropic-ai/claude-code
```

Start:

```bash
cd /path/to/tastemap-date
claude
```

Useful commands inside Claude Code:

```txt
/help
/init
/clear
/review
/status
```

Recommended workflow:

```txt
1. Start claude
2. Ask it to read @docs/ai-prompts/00-claude-general-intro.md
3. Execute one phase at a time
4. Run tests/build
5. Commit
6. Let Codex review
```

Example:

```txt
Please read @docs/ai-prompts/00-claude-general-intro.md.
Then execute @docs/ai-prompts/01-phase-0-scope-architecture.md.
Do not proceed to Phase 1 until Phase 0 acceptance criteria pass.
```

One-shot mode:

```bash
claude -p "$(cat docs/ai-prompts/01-phase-0-scope-architecture.md)"
```

PowerShell:

```powershell
claude -p (Get-Content docs/ai-prompts/01-phase-0-scope-architecture.md -Raw)
```

---

## Claude Code Custom Slash Commands

Claude Code supports project-level slash commands as Markdown files.

You can copy prompt files into:

```txt
.claude/commands/
```

Example:

```bash
mkdir -p .claude/commands
cp docs/ai-prompts/01-phase-0-scope-architecture.md .claude/commands/tastemap-phase-0.md
cp docs/ai-prompts/02-phase-1-product-skeleton-mock-data.md .claude/commands/tastemap-phase-1.md
cp docs/ai-prompts/03-phase-2-matching-ai-request-flow.md .claude/commands/tastemap-phase-2.md
cp docs/ai-prompts/04-phase-3-gcp-cicd-testing-demo.md .claude/commands/tastemap-phase-3.md
```

Then inside Claude Code:

```txt
/tastemap-phase-0
/tastemap-phase-1
/tastemap-phase-2
/tastemap-phase-3
```

---

## Codex CLI

Install:

```bash
npm install -g @openai/codex
```

Start:

```bash
cd /path/to/tastemap-date
codex
```

Run review prompt:

```bash
codex "$(cat docs/ai-prompts/05-codex-review-and-fix-prompts.md)"
```

PowerShell:

```powershell
codex (Get-Content docs/ai-prompts/05-codex-review-and-fix-prompts.md -Raw)
```

---

## Codex Approval Modes

Recommended usage:

| Mode | Use case |
|---|---|
| default / suggest | Code review, architecture review, interview Q&A |
| `--auto-edit` | Small fixes after commit |
| `--full-auto` | Avoid unless repo is committed and task is tightly scoped |

Example safe fix:

```bash
git checkout -b fix/codex-phase-2-review
codex --auto-edit "$(cat docs/ai-prompts/05-codex-review-and-fix-prompts.md)"
npm run typecheck
npm run test
npm run build
```

---

## Git Discipline

After each phase:

```bash
npm run typecheck
npm run test
npm run build
git status
git add .
git commit -m "message"
```

Suggested commits:

```bash
git commit -m "chore: establish TasteMap Date MVP foundation"
git commit -m "feat: build product skeleton and mock taste map"
git commit -m "feat: add matching ai advice and date request flow"
git commit -m "chore: add gcp deployment ci and demo polish"
```

---

## Best Practice

Do not ask Claude and Codex to edit the same thing at the same time.

Recommended sequence:

```txt
Claude builds → commit → Codex reviews → small fixes → commit → next Phase
```
