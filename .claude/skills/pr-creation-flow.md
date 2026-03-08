# PR Creation Skill

## Requirements

- [GitHub CLI (gh)](https://cli.github.com/) installed and authenticated

## Configuration

Update these values for your organization:
- **JIRA_ORG**: `your-org` (your Jira subdomain)
- **TICKET_PREFIX**: `PROJ` (your project key, e.g., KAN, ENG, FEAT)

---

## Step 1: Create PR

1. Get commits on this branch vs main: `git log main..HEAD`
2. Get diff stats: `git diff main...HEAD --stat`
3. Extract JIRA ticket ID from branch name:
   - Branch format examples: `PROJ-1234/feature-description`, `PROJ-1234-some-feature`, `feature/PROJ-1234`
   - Extract the `PROJ-XXXX` pattern from the branch name
   - Create full JIRA link: `https://your-org.atlassian.net/browse/PROJ-XXXX`
4. Create PR title in format: `[PROJ-XXXX] High level description`
   - Example: `[PROJ-1234] [Brief summary of changes]`
5. Push branch to remote if not already pushed:
   - Check if branch has upstream
   - If no upstream, push with: `git push -u origin <branch-name>`
6. Use `gh pr create` to create the PR

## Step 2: Update PR Description

Use `gh pr edit <PR_NUMBER> --body "..."` to update the PR description.

Fill in each section:

### Jira
- Replace `<Insert your JIRA link here>` with the full URL: `https://your-org.atlassian.net/browse/PROJ-XXXX`

### Pull Request Summary
- Add a high-level 1-2 sentence summary right after the Jira link (before Change Description)
- This explains what the PR accomplishes at a glance

### Change Description
- Detailed breakdown of all changes
- Use numbered list or bullet points for each change
- Include specifics of what was modified

### Change Classification
- Check the appropriate primary change type
- Check whether feature toggle is required

### Proof (add at end if applicable)
- Screenshots, test cases, or evidence demonstrating the changes work as expected
