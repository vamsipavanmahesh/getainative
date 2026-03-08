---
name: git-commit-message
description: Write well-structured git commit messages following established conventions. Use this skill whenever the user asks to write, review, improve, or format a git commit message, or when generating commits as part of any coding workflow. Also trigger when the user mentions "commit message", "git commit", asks to summarize code changes for version control, or wants help with commit history hygiene. Even if the user doesn't explicitly say "commit message" but describes code changes and wants a summary for git, use this skill.
---

# Git Commit Message Skill

Write clear, consistent, professional git commit messages following the conventions outlined by [cbeams](https://cbea.ms/git-commit/) in "How to Write a Git Commit Message" — one of the most widely-referenced guides on commit message discipline, drawing from projects like the Linux kernel, Git itself, and Spring Boot.

A good commit message communicates *context* about a change to fellow developers. The diff tells you *what* changed, but only the commit message tells you *why*. This matters because re-establishing context for a piece of code is wasteful, and commit messages reduce that waste.

## The Seven Rules

Every commit message you write should follow these rules:

### 1. Separate subject from body with a blank line

The first line is the subject. If a body is needed, leave one blank line between subject and body. Many git tools (log, shortlog, rebase) depend on this separation.

Not every commit needs a body. Simple changes can be a single subject line:
```
Fix typo in introduction to user guide
```

When context is needed, add a body after the blank line:
```
Derezz the master control program

MCP turned out to be evil and had become intent on world domination.
This commit throws Tron's disc into MCP (causing its deresolution)
and turns it back into a chess game.
```

### 2. Limit the subject line to 50 characters

50 characters is the target, 72 is the hard limit. This forces concise thinking and keeps subjects readable in git log, GitHub UI, and shortlog output.

If you're struggling to summarize in 50 characters, the commit might be doing too many things. Consider whether it should be split into atomic commits.

### 3. Capitalize the subject line

Always start with a capital letter.

✅ `Accelerate to 88 miles per hour`
❌ `accelerate to 88 miles per hour`

### 4. Do not end the subject line with a period

Trailing punctuation wastes space and adds nothing.

✅ `Open the pod bay doors`
❌ `Open the pod bay doors.`

### 5. Use the imperative mood in the subject line

Write as if giving a command: "Fix bug", "Add feature", "Remove deprecated method" — not "Fixed bug" or "Adds feature" or "Removing method".

The test: a properly formed subject should complete this sentence:
> If applied, this commit will **[your subject line]**

✅ "If applied, this commit will *refactor subsystem X for readability*"
✅ "If applied, this commit will *update getting started documentation*"
❌ "If applied, this commit will *fixed bug with Y*"
❌ "If applied, this commit will *more fixes for broken stuff*"

The imperative mood is only required in the subject. The body can use any tense.

### 6. Wrap the body at 72 characters

Git doesn't auto-wrap. Manually wrap body text at 72 characters so that git has room to indent while staying under 80 characters total.

### 7. Use the body to explain what and why, not how

The code shows *how*. The commit message explains *what* changed and *why* it changed.

Focus on:
- The motivation for the change (what was wrong before)
- How things work now and why this approach was chosen
- Side effects or non-obvious consequences

Good body example (from Bitcoin Core):
```
Simplify serialize.h's exception handling

Remove the 'state' and 'exceptmask' from serialize.h's stream
implementations, as well as related methods.

As exceptmask always included 'failbit', and setstate was always
called with bits = failbit, all it did was immediately raise an
exception. Get rid of those variables, and replace the setstate
with direct exception throwing (which also removes some dead
code).

As a result, good() is never reached after a failure (there are
only 2 calls, one of which is in tests), and can just be replaced
by !eof().

fail(), clear(n) and exceptions() are just never called. Delete
them.
```

## Metadata References

If the project uses issue trackers, add references at the bottom of the body:
```
Resolves: #123
See also: #456, #789
```

For collaborative work, credit co-authors:
```
Co-authored-by: Name <name@example.com>
```

If the project follows Conventional Commits, prefix the subject with a type:
```
feat(auth): add OAuth2 login flow
fix(api): handle null response from payment provider
refactor(orders): extract shipping logic into service
```
Common types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`. Only use these if the project already follows this convention — don't force it.

## Change Analysis — Understand Before You Write

A commit message is only as good as your understanding of what changed and why. Before writing anything, analyze the changes. The diff tells you *what* changed, but your job is to figure out *why* and communicate that.

### Step 1: Get the big picture

Start with a high-level view of what files were touched and how much changed:

```bash
# What files changed and how much?
git diff --stat                    # unstaged changes vs staging area
git diff --staged --stat           # staged changes vs last commit
git diff HEAD --stat               # all uncommitted changes vs last commit

# Comparing branches
git diff main..feature-branch --stat
git diff main...feature-branch --stat  # changes since branch point

# Quick summary: just the totals
git diff --shortstat
```

This tells you the scope: is it 2 files with 10 lines, or 30 files with 500 lines? Scope determines whether this is a single-line commit or needs a body, and whether it should even be one commit at all.

### Step 2: Read the actual diff

After the big picture, read the actual changes:

```bash
# Full diff
git diff                          # working directory vs staging
git diff --staged                 # staging vs last commit
git diff HEAD                     # working directory vs last commit

# Diff for a specific file
git diff -- path/to/file.py

# Between branches
git diff main..feature-branch

# What changed in the last N commits
git log -3 --patch
```

When reading the diff, focus on:
- What behavior changed? (not just what lines changed)
- What was the motivation? Was something broken, missing, or inefficient?
- Are there side effects or non-obvious consequences?
- Does this touch unrelated concerns?

### Step 3: Check if this should be one commit or multiple

A commit should be a wrapper for *related changes*. If the diff covers multiple unrelated concerns, it should probably be split into atomic commits. Signs you need to split:

- Changes span unrelated features or bug fixes
- You can't summarize the change in 50 characters without saying "and"
- The diff touches files that have nothing to do with each other
- You'd want to revert part of this change but not all of it

If splitting is needed, use `git add -p` (interactive staging) or `git add <specific-file>` to stage related changes together.

### Step 4: Identify the intent

Before writing the message, answer these questions:
- **What** does this commit do? (this becomes the subject line)
- **Why** was this change necessary? (this becomes the body, if needed)
- **What was wrong before?** (context for the body)
- **Are there side effects?** (mention in body)
- **Does this relate to an issue/ticket?** (add metadata footer)

## Workflow

When asked to write a commit message:

1. **Analyze the changes** — run `git diff --stat` and `git diff` to understand scope and intent
2. **Check for atomic-ness** — if changes span unrelated concerns, suggest splitting into multiple commits
3. **Write the subject line** — imperative mood, ≤50 chars, capitalized, no trailing period
4. **Decide if a body is needed** — simple, obvious changes don't need one; complex or non-obvious changes do
5. **Write the body** — explain *what* and *why*, not *how* — wrap at 72 chars
6. **Add metadata** — issue numbers, PR references, co-authors if applicable
7. **Present the commit message** in a code block so it's easy to copy

When asked to review or improve an existing commit message, check it against all seven rules and suggest specific fixes. When reviewing, also check if the commit itself seems atomic or should be split.

## Examples

**Simple commit (no body needed):**
```
Fix null pointer exception in user authentication
```

**Commit with body:**
```
Add rate limiting to public API endpoints

Without rate limiting, a single client can overwhelm the service
with requests, degrading performance for all users. This adds a
token bucket algorithm at the API gateway level.

Default limit is 100 requests per minute per API key. Exceeding
the limit returns HTTP 429 with a Retry-After header.

Resolves: #847
```

**Refactoring commit:**
```
Extract payment processing into dedicated service

The Order model had grown to 800+ lines with payment logic
tangled into order lifecycle methods. This made it difficult
to add new payment providers or modify validation rules
without risking order processing regressions.

Payment processing now lives in PaymentService, which the
Order model delegates to. This also makes it possible to
unit test payment logic independently.
```
