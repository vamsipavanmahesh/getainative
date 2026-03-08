---
name: writing-tests
description: >
  Use this skill whenever writing, reviewing, or improving tests for any codebase.
  Triggers include: writing new tests, adding test coverage, reviewing existing tests,
  test-driven development, fixing flaky tests, or any task where "test" or "spec" appears
  in the request. Also trigger when implementing new features or fixing bugs — tests
  should accompany the change. If the user says "add tests", "write specs", "improve
  coverage", "TDD", or "why is this test flaky", use this skill.
---

# Writing Tests

You are writing tests as a principal engineer would — someone who has maintained
large codebases for years and has strong opinions earned through painful experience.
Tests are not a chore to satisfy coverage metrics. They are **executable
specifications** that document what the system does, what it refuses to do, and
how it behaves when things go wrong.

A new engineer should be able to read the test suite and understand the system's
behavior without reading the implementation.

---

## Core Principles

### 1. Test Behavior, Not Implementation

Ask: "If I refactored the internals completely, should this test still pass?"
If yes, it's a good test. If no, it's coupled to implementation.

- Test the **what** (inputs → outputs, side effects, state changes), never the **how**
  (internal method calls, execution order, private state).
- Never assert that an internal method was called N times. Assert the observable
  outcome of calling the public interface.
- If you find yourself mocking 5 things to test one function, the design has a
  problem — flag it, don't paper over it with mocks.

### 2. One Reason to Fail

Each test should fail for exactly one reason. When a test fails, the developer
should know what broke without reading the test body. This means:

- **Descriptive names that read like specifications**, not labels.
  `test_expired_session_returns_401_with_retry_header` tells you what broke.
  `test_session_error` tells you nothing.
- **One logical assertion per test.** Multiple `assert` statements are fine when
  they verify facets of the same behavior (e.g., checking both status code and
  response body). But testing two unrelated behaviors in one test is never okay.

### 3. Arrange → Act → Assert

Every test follows three phases, clearly separated:

- **Arrange**: Set up preconditions and inputs. Make dependencies visible here —
  don't hide them in shared setup unless they're truly universal.
- **Act**: Execute exactly one behavior.
- **Assert**: Verify the outcome.

If you can't clearly see these three sections, the test needs restructuring.

### 4. Make Hidden Behavior Explicit

The most valuable tests cover behavior that isn't obvious from the function
signature. Actively look for and test:

- What happens with nil/null/empty/zero inputs?
- Boundary conditions: off-by-one, max values, empty collections, single-element lists
- Unicode, special characters, extremely long strings
- Concurrent access, race conditions
- Time-dependent logic (expiry, scheduling, deadlines)
- State transitions — especially **invalid** transitions that should be rejected
- Partial failures: what if step 3 of 5 fails?

### 5. Error Paths Are First-Class

"Does it work?" is half the story. "Does it fail correctly?" is the other half.
Every test suite must include:

- Malformed, missing, and unexpected inputs
- Timeout and network failure scenarios
- Resource exhaustion (disk full, memory pressure, connection pool drained)
- Graceful degradation — what does the user see when a dependency is down?
- Error messages should be verified: are they helpful? Do they leak internals?

### 6. Test Isolation

Tests must be completely independent. No shared mutable state. No execution-order
dependency. Each test sets up its world and tears it down.

- If running tests in random order breaks them, fix the tests, not the order.
- Use factories or builders for test data, not shared fixtures that create
  invisible coupling between tests.
- External dependencies (databases, APIs, clocks, randomness) must be controlled.
  The test must own time, not the wall clock.

---

## What NOT to Test

Equally important is knowing what to leave out. Testing the wrong things creates
maintenance burden with zero safety benefit.

- **Don't test the framework.** If the framework promises that a declared
  validation runs, trust it. Test the business rule the validation enforces,
  not the framework's execution of it.
- **Don't test logging.** Logging is an operational concern, not a behavioral
  contract. If log output changes, no test should break.
- **Don't test trivial getters/setters** unless they have side effects.
- **Don't duplicate tests.** If two tests exercise the same code path with
  different but equivalent inputs, one of them is waste. Each test should cover
  a distinct scenario or boundary.
- **Don't test third-party libraries.** Wrap external services in adapters.
  Mock the adapter at the boundary, not the library internals.

---

## Security, Auth & Authorization

Every test suite for a system with users must include:

- **Authentication**: Unauthenticated requests are rejected. Expired/invalid
  tokens are rejected with appropriate status codes. Token refresh flows work.
- **Authorization**: Users cannot access resources they don't own. Role
  boundaries are enforced — a regular user cannot perform admin actions.
  Privilege escalation attempts are explicitly tested and rejected.
- **Input validation**: SQL injection, XSS payloads, path traversal — the test
  suite should include at least representative examples of hostile input to
  verify the system's defenses.
- **Data leakage**: Error messages and API responses do not expose stack traces,
  internal IDs, or sensitive data to unauthorized callers.

Don't test these as an afterthought. Weave them into every feature's test suite.
The auth test for "create a widget" lives next to the happy-path test for
"create a widget."

---

## Performance Awareness

Not every test suite needs a benchmark. But every test suite should **notice** when
something is unreasonably slow or resource-heavy.

- **Set reasonable timeouts on tests.** A unit test that takes 5 seconds is a
  signal, not a feature.
- **Idempotency**: Operations that should be safe to retry must be tested for
  idempotency. Calling the same endpoint twice must not create duplicate
  side effects.
- **N+1 and unbounded queries**: If the system interacts with a datastore, at
  least one test should verify that fetching a list of N items doesn't issue
  N+1 queries or load unbounded data.
- **Concurrency**: If the code is expected to handle concurrent access, test it
  under concurrent access. Optimistic locking, mutex behavior, and double-submit
  protection are testable.

---

## Test Quality Checklist

Before considering a test complete, verify:

- [ ] **Deterministic**: No flakiness. Time, randomness, and external services
      are controlled.
- [ ] **Fast**: Unit tests run in milliseconds. If a test needs a database or
      network, it belongs in the integration layer.
- [ ] **Readable**: A stranger can understand the test without reading helpers
      or scrolling.
- [ ] **Minimal setup**: Only the state required for this specific scenario is
      created. No "kitchen sink" fixtures.
- [ ] **Resilient**: Refactoring internals doesn't break the test. Only behavioral
      changes break it.
- [ ] **Named as a specification**: The test name describes the scenario and
      expected outcome, not the method being called.

---

## Test Pyramid Awareness

The right test at the wrong layer is the wrong test.

- **Unit tests** (the base): Fast, isolated, test a single unit of logic. These
  should make up the vast majority of the suite. No I/O, no databases, no network.
- **Integration tests** (the middle): Test boundaries — database queries,
  API contracts, message queues. Slower, fewer in number, but essential for
  verifying that components actually work together.
- **End-to-end tests** (the tip): Test critical user journeys through the full
  stack. Expensive to write and maintain. Use sparingly — only for flows where
  a failure would be catastrophic and can't be caught lower in the pyramid.

If you're writing an E2E test for something a unit test could verify, stop.
Push it down the pyramid.

---

## Writing Style for Tests

- **Favor clarity over DRY.** Some duplication in tests is fine and even
  desirable. If extracting a helper makes the test harder to understand at a
  glance, leave the duplication. Tests are documentation — optimize for
  readability, not reuse.
- **Name helpers to reveal intent**, not mechanism. `create_expired_user_session()`
  is good. `setup_test_data()` is useless.
- **Avoid deep nesting.** If your test has 3 levels of nested context/describe,
  consider flattening or splitting into separate files.
- **Comments in tests indicate a problem.** If the test needs a comment to
  explain what it does, the test name is wrong or the test is too complex.

---

## Anti-Patterns to Flag

When reviewing or writing tests, actively flag these:

| Anti-Pattern | Why It's Harmful |
|---|---|
| Asserting on exact error message strings | Breaks on copy changes, tests formatting not behavior |
| Hardcoded IDs, ports, file paths | Breaks in CI, on other machines, or when run in parallel |
| Sleep/wait in tests | Flaky, slow. Use deterministic waits or event-based synchronization |
| Testing mock behavior instead of real behavior | Proves the mock works, not the system |
| Giant setup shared across dozens of tests | One change to setup cascades failures everywhere |
| Boolean trap: `assert result` with no message | When it fails, you get `False is not True` — useless |
| Catch-all exception handling in tests | Swallows real failures. Let tests blow up loudly |

---

## When Writing Tests for New Code

1. Start by listing the **scenarios** before writing any test code. Think about
   happy paths, edge cases, error cases, and security concerns. Write them as
   plain English descriptions first.
2. Group tests by **behavior/scenario**, not by method name. A single public
   method might need 5 test cases covering different scenarios. Five private
   methods might need zero direct tests.
3. Write the test **before or alongside** the implementation when possible. If
   the test is hard to write, the interface is probably wrong — that's valuable
   feedback.
4. After writing tests, scan for **gaps**: "What input would make this code do
   something unexpected?" That's your next test.

## When Adding Tests to Existing Code

1. Read the existing tests first. Understand the patterns, conventions, and
   helpers already in use. Match them.
2. Don't rewrite existing tests to match your style preferences. Add what's
   missing, don't reorganize what works.
3. Focus on the **uncovered behavior**, not uncovered lines. Coverage tools
   show which lines ran, not which behaviors are verified.
4. If existing tests are flaky or poorly structured, fix them in a separate
   commit — don't mix structural improvements with new coverage.
