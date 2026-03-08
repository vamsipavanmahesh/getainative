---
name: code-review
description: Perform a principal-engineer-level code review of a Git branch. Use this skill whenever the user asks to review a branch, PR, set of changes, or diff — including phrases like "review this branch", "what changed in this PR", "onboard me on these changes", "is this ready to merge", or "code review". Produces a comprehensive, beautifully formatted HTML report with summary, file-by-file analysis, ASCII flow diagrams, regression risks, improvement suggestions, and a merge verdict.
---

# Code Review Skill

Perform a thorough, principal-engineer-level review of a Git branch and produce a self-contained HTML report.

## Prerequisites

Before starting, confirm the following:

1. You are inside a Git repository.
2. Identify the **current branch** (`git branch --show-current`).
3. Identify the **base branch** to compare against. Default heuristic (in order): `main`, `master`, `develop`. If ambiguous, ask the user.
4. Run `git fetch origin` so the diff is up to date.

## Gathering the Diff

```bash
BASE=main  # or whichever base branch
CURRENT=$(git branch --show-current)

# Full diff for analysis
git diff ${BASE}...${CURRENT} > /tmp/review_full.diff

# Stat summary
git diff --stat ${BASE}...${CURRENT}

# Commit log for context
git log --oneline ${BASE}...${CURRENT}
```

Read the full diff and every changed file in its entirety — not just the hunks. Context matters: understand what the surrounding code does, not just what changed.

## Review Process

Work through these steps sequentially. Think like a principal engineer who is responsible for the health of the codebase and the growth of the team.

### Step 1 — Understand Intent

Before critiquing anything, figure out **what this branch is trying to accomplish**:

- Read commit messages, PR description (if available), branch name.
- Identify the feature, bugfix, refactor, or chore being done.
- Note whether the scope feels right — is it doing too much or too little for one branch?

Write a concise 3–5 sentence summary of the branch's purpose.

### Step 2 — Map the Changes

Build a mental (and visual) model of the change:

- Group files by domain/concern (e.g., models, controllers, services, tests, config, migrations).
- Determine the **recommended review order** — start with schema/data changes, then domain logic, then API/interface layer, then tests, then config/infra. Explain *why* this order helps comprehension.
- Count: files changed, lines added, lines removed, new files, deleted files.

### Step 3 — ASCII Flow Diagrams

Wherever the changes involve a multi-step process, request/response flow, state transition, data pipeline, or interaction between components, draw an ASCII diagram. These are enormously helpful for reviewers.

Good candidates for diagrams:
- API request → service → external call → response flows
- State machines or status transitions
- Data transformation pipelines
- Before/after architecture comparisons
- Event/message flows between systems

Use box-drawing characters for clarity:

```
┌──────────┐     ┌───────────┐     ┌──────────┐
│ Controller│────▶│  Service   │────▶│   Repo   │
└──────────┘     └───────────┘     └──────────┘
                       │
                       ▼
                 ┌───────────┐
                 │ External  │
                 │   API     │
                 └───────────┘
```

Include at least one diagram. For complex branches, include several.

### Step 4 — File-Level Analysis Table

For **every changed file**, produce a row in a table with these columns:

| Column | What to write |
|--------|---------------|
| **File** | Relative path |
| **Type** | Added / Modified / Deleted / Renamed |
| **Before** | What this file did (or "N/A" if new) |
| **After** | What it does now after the changes |
| **What It Means** | Plain-English impact of this change on the system |
| **Risk** | 🟢 Low / 🟡 Medium / 🔴 High — with a one-line reason |

Sort the table in the recommended review order from Step 2.

### Step 5 — Regression Risk Analysis

Think adversarially. For each risk, describe:

- **What could break**: concrete scenario, not vague hand-waving.
- **Why**: which specific change introduces the risk.
- **Severity**: Critical / High / Medium / Low.
- **Mitigation**: what test, guard, or rollback strategy would reduce the risk.

Common regression vectors to check:
- Database migrations that aren't backward-compatible
- Changed method signatures or return types that callers depend on
- Removed or renamed constants/configs
- Race conditions in concurrent/async code
- N+1 queries introduced by new associations
- Missing index on new query patterns
- Error handling gaps (happy path works, sad path explodes)
- Side effects in callbacks or hooks that fire in unexpected contexts

### Step 6 — Suggestions for Improvement

Categorize suggestions by priority:

- **Must Fix** — Bugs, security issues, data-loss risks. These block approval.
- **Should Fix** — Code quality, maintainability, missing tests, unclear naming. Strongly recommended before merge.
- **Nice to Have** — Style nits, minor refactors, documentation improvements. Can be done in a follow-up.

For each suggestion, include the file, line/context, what's wrong, and a concrete fix or direction (not just "this could be better").

### Step 7 — Verdict

Issue one of four verdicts:

| Verdict | When to use |
|---------|-------------|
| ✅ **Approved** | No issues. Ship it. |
| 💬 **Approved with Comments** | Minor suggestions that don't block merging. Author should address in this PR or a fast follow-up. |
| 🔄 **Request Changes** | Issues that must be resolved before merging. Explain clearly what needs to change. |
| 🚫 **Needs Rethink** | Fundamental approach concerns. Suggest an alternative direction or a conversation before more code is written. |

Include a short paragraph justifying the verdict. Be direct but constructive — the goal is to help the author ship great code, not to gatekeep.

## Output Format

Generate a single, self-contained HTML file. The filename format is:

```
{agent_name}_{branch_name}_review.html
```

Where `{agent_name}` is `claude` (or a custom name if the user specifies one), and `{branch_name}` is the current branch with slashes replaced by underscores.

### HTML Report Structure

Read the HTML template reference at `references/report-template.md` for the full template. The report must include these sections in order:

1. **Header** — Branch name, base branch, date, commit count, overall verdict badge.
2. **Executive Summary** — 3–5 sentence overview of what this branch does.
3. **Branch Stats** — Files changed, insertions, deletions, commits.
4. **Recommended Review Order** — Numbered list with rationale.
5. **Architecture / Flow Diagrams** — ASCII diagrams in `<pre>` blocks with a monospace font.
6. **File-Level Changes Table** — Full table from Step 4.
7. **Regression Risks** — Cards or table from Step 5.
8. **Suggestions** — Grouped by priority from Step 6.
9. **Verdict** — Final verdict with justification from Step 7.
10. **Footer** — Generation timestamp, tool version note.

### HTML Styling Requirements

The HTML must be:
- Self-contained (inline CSS, no external dependencies).
- Dark-themed with a professional, readable design.
- Uses a monospace font for code and diagrams (`'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace`).
- Uses a clean sans-serif for body text (`'Inter', 'Segoe UI', system-ui, sans-serif`).
- Color-coded risk badges (green/yellow/red).
- Verdict badge prominently displayed in the header.
- Responsive and printable.
- Syntax-highlighted code snippets where file contents or diffs are shown.

Use these color tokens for consistency:
- Background: `#0d1117`
- Surface: `#161b22`
- Border: `#30363d`
- Text primary: `#e6edf3`
- Text secondary: `#8b949e`
- Green (approved/low risk): `#3fb950`
- Yellow (comments/medium risk): `#d29922`
- Red (request changes/high risk): `#f85149`
- Blue (info/accent): `#58a6ff`

## After Generating

1. Save the HTML file to the working directory.
2. Open it in the browser so the user can see it immediately.
3. Offer to go deeper on any specific file, concern, or suggestion.

## Edge Cases

- **Huge diffs (50+ files)**: Group by domain, summarize low-risk files briefly, focus detailed analysis on high-risk and core logic files. Note that the review is prioritized and offer to deep-dive on specific areas.
- **No test changes**: Flag this explicitly. If the branch adds/modifies logic without corresponding tests, this should appear in Suggestions as a "Should Fix."
- **Migration-only or config-only branches**: Adjust the template — skip flow diagrams if they don't add value, focus on backward compatibility and rollback safety.
- **Merge conflicts visible in diff**: Note them prominently at the top of the report.

# HTML Report Template Reference

Use this as a structural guide when generating the review HTML. Do not copy this verbatim — adapt section contents to the actual branch being reviewed. All CSS must be inline in a `<style>` block (no external dependencies).

## Minimal Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Review: BRANCH_NAME</title>
  <style>
    /* --- Reset & Base --- */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #0d1117;
      color: #e6edf3;
      line-height: 1.6;
      padding: 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    /* --- Typography --- */
    h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    h2 {
      font-size: 1.3rem;
      color: #58a6ff;
      border-bottom: 1px solid #30363d;
      padding-bottom: 0.5rem;
      margin: 2rem 0 1rem;
    }
    h3 { font-size: 1.1rem; color: #e6edf3; margin: 1.2rem 0 0.5rem; }
    p, li { color: #c9d1d9; }
    a { color: #58a6ff; text-decoration: none; }

    code, pre {
      font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    }

    code {
      background: #1c2128;
      padding: 0.15em 0.4em;
      border-radius: 4px;
      font-size: 0.9em;
    }

    pre {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 1rem;
      overflow-x: auto;
      font-size: 0.85rem;
      line-height: 1.5;
      margin: 1rem 0;
    }

    /* --- Layout Components --- */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #30363d;
    }

    .header-meta { color: #8b949e; font-size: 0.9rem; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .stat-card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
    }

    .stat-card .value {
      font-size: 1.6rem;
      font-weight: 700;
      color: #e6edf3;
    }

    .stat-card .label {
      font-size: 0.8rem;
      color: #8b949e;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* --- Table --- */
    .table-wrapper { overflow-x: auto; margin: 1rem 0; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }

    th {
      background: #1c2128;
      color: #8b949e;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 2px solid #30363d;
      position: sticky;
      top: 0;
    }

    td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #21262d;
      vertical-align: top;
    }

    tr:hover td { background: #1c2128; }

    /* --- Badges --- */
    .badge {
      display: inline-block;
      padding: 0.2em 0.7em;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    .badge-approved     { background: #12261e; color: #3fb950; border: 1px solid #238636; }
    .badge-comments     { background: #2a1f0a; color: #d29922; border: 1px solid #9e6a03; }
    .badge-changes      { background: #2d1214; color: #f85149; border: 1px solid #da3633; }
    .badge-rethink      { background: #2d1214; color: #f85149; border: 1px solid #da3633; }

    .risk-low    { color: #3fb950; }
    .risk-medium { color: #d29922; }
    .risk-high   { color: #f85149; }

    /* --- Cards (for risks, suggestions) --- */
    .card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin: 0.75rem 0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .card.must-fix    { border-left: 3px solid #f85149; }
    .card.should-fix  { border-left: 3px solid #d29922; }
    .card.nice-to-have { border-left: 3px solid #58a6ff; }

    /* --- Verdict Section --- */
    .verdict-box {
      background: #161b22;
      border: 2px solid #30363d;
      border-radius: 12px;
      padding: 1.5rem 2rem;
      margin: 2rem 0;
      text-align: center;
    }

    .verdict-box .verdict-label {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    .verdict-box .verdict-note {
      color: #8b949e;
      max-width: 600px;
      margin: 0 auto;
    }

    /* --- Review Order --- */
    .review-order ol {
      counter-reset: review-step;
      list-style: none;
      padding: 0;
    }

    .review-order li {
      counter-increment: review-step;
      padding: 0.5rem 0 0.5rem 2.5rem;
      position: relative;
    }

    .review-order li::before {
      content: counter(review-step);
      position: absolute;
      left: 0;
      width: 1.8rem;
      height: 1.8rem;
      background: #1c2128;
      border: 1px solid #30363d;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 600;
      color: #58a6ff;
    }

    /* --- Footer --- */
    .footer {
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 1px solid #30363d;
      color: #484f58;
      font-size: 0.8rem;
      text-align: center;
    }

    /* --- Responsive --- */
    @media (max-width: 768px) {
      body { padding: 1rem; }
      .header { flex-direction: column; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }

    /* --- Print --- */
    @media print {
      body { background: white; color: #1a1a1a; }
      .card, .stat-card, pre { border-color: #ccc; background: #f6f6f6; }
      h2 { color: #0366d6; }
    }
  </style>
</head>
<body>

  <!-- 1. HEADER -->
  <div class="header">
    <div>
      <h1>Code Review: BRANCH_NAME</h1>
      <div class="header-meta">
        Base: <code>BASE_BRANCH</code> · Reviewed: DATE · COMMIT_COUNT commits
      </div>
    </div>
    <div>
      <!-- Use the appropriate badge class -->
      <span class="badge badge-approved">✅ Approved</span>
      <!-- Or: badge-comments, badge-changes, badge-rethink -->
    </div>
  </div>

  <!-- 2. EXECUTIVE SUMMARY -->
  <h2>Executive Summary</h2>
  <p>3–5 sentence summary of the branch purpose and approach.</p>

  <!-- 3. BRANCH STATS -->
  <h2>Branch Stats</h2>
  <div class="stats-grid">
    <div class="stat-card"><div class="value">N</div><div class="label">Files Changed</div></div>
    <div class="stat-card"><div class="value" style="color:#3fb950">+N</div><div class="label">Insertions</div></div>
    <div class="stat-card"><div class="value" style="color:#f85149">-N</div><div class="label">Deletions</div></div>
    <div class="stat-card"><div class="value">N</div><div class="label">Commits</div></div>
  </div>

  <!-- 4. RECOMMENDED REVIEW ORDER -->
  <h2>Recommended Review Order</h2>
  <div class="review-order">
    <ol>
      <li><code>path/to/file</code> — Reason to start here</li>
      <li><code>path/to/file</code> — Reason this comes next</li>
    </ol>
  </div>

  <!-- 5. FLOW DIAGRAMS -->
  <h2>Architecture &amp; Flow</h2>
  <pre>
┌────────────┐     ┌─────────────┐     ┌────────────┐
│  Component │────▶│   Service   │────▶│  External  │
└────────────┘     └─────────────┘     └────────────┘
  </pre>
  <p>Explanation of what the diagram shows and how the changes affect this flow.</p>

  <!-- 6. FILE-LEVEL CHANGES -->
  <h2>File-Level Changes</h2>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>File</th>
          <th>Type</th>
          <th>Before</th>
          <th>After</th>
          <th>Impact</th>
          <th>Risk</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>path/to/file.rb</code></td>
          <td>Modified</td>
          <td>What it did before</td>
          <td>What it does now</td>
          <td>Plain-English impact</td>
          <td><span class="risk-low">🟢 Low</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 7. REGRESSION RISKS -->
  <h2>Regression Risks</h2>
  <div class="card">
    <div class="card-header">
      <strong>Risk Title</strong>
      <span class="badge badge-changes">Critical</span>
    </div>
    <p><strong>What could break:</strong> Concrete scenario.</p>
    <p><strong>Cause:</strong> Which change introduces this.</p>
    <p><strong>Mitigation:</strong> How to guard against it.</p>
  </div>

  <!-- 8. SUGGESTIONS -->
  <h2>Suggestions</h2>

  <h3>Must Fix</h3>
  <div class="card must-fix">
    <p><strong>File:</strong> <code>path/to/file.rb</code></p>
    <p>Description of the issue and a concrete fix.</p>
  </div>

  <h3>Should Fix</h3>
  <div class="card should-fix">
    <p><strong>File:</strong> <code>path/to/file.rb</code></p>
    <p>Description and recommendation.</p>
  </div>

  <h3>Nice to Have</h3>
  <div class="card nice-to-have">
    <p><strong>File:</strong> <code>path/to/file.rb</code></p>
    <p>Minor suggestion.</p>
  </div>

  <!-- 9. VERDICT -->
  <div class="verdict-box">
    <div class="verdict-label" style="color: #3fb950;">✅ Approved</div>
    <p class="verdict-note">Justification paragraph explaining why this verdict was given.</p>
  </div>

  <!-- 10. FOOTER -->
  <div class="footer">
    Generated by Claude Code Review · DATE_TIME
  </div>

</body>
</html>
```

## Notes on Template Usage

- Replace ALL_CAPS placeholders with real data from the branch.
- Add or remove sections as appropriate (e.g., skip flow diagrams for config-only changes).
- For syntax-highlighted diffs, wrap them in `<pre>` with color spans:
  - Added lines: `<span style="color:#3fb950">+ line</span>`
  - Removed lines: `<span style="color:#f85149">- line</span>`
- Ensure all `<pre>` blocks preserve whitespace for ASCII diagrams.
- The file must be fully self-contained — no external font imports, CDN links, or JavaScript dependencies.
