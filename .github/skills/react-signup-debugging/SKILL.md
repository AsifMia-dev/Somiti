---
name: react-signup-debugging
description: "Use when debugging React signup/auth issues, checking missing providers in the component tree, handling failed fetch responses, and adding error boundaries to keep the UI stable."
---

# React Signup Debugging

## When to use
- A signup form crashes or becomes unresponsive during submit
- `useContext` or provider-related runtime errors appear in the console
- The form submits but shows no success/error feedback
- The auth page fails to render or a child component throws unexpectedly

## Workflow

1. Reproduce the issue in the browser and inspect the console.
2. Trace the component tree to find the exact component throwing or reading undefined data.
3. Check whether required providers exist above the component in the render tree.
4. Validate the form submission flow: request body, API endpoint, response status, and JSON parsing.
5. Guard against missing or malformed API responses before displaying success or error states.
6. Add a recovery layer such as an error boundary around the auth subtree to prevent a total crash.
7. Re-test the submit flow and confirm the auth UI still renders after recoverable errors.

## Decision points

- If a component reads from context and the value is undefined:
  - confirm the provider is mounted above the component
  - wrap the relevant subtree in the correct provider

- If the fetch call fails or returns a non-2xx status:
  - inspect the payload shape (`data.error`, `data.message`)
  - show a toast or inline error without crashing the page

- If a render bug causes the whole component tree to fail:
  - add an `ErrorBoundary`
  - provide a fallback UI with a reset action if needed

## Quality checks

- No `useContext` access on an undefined provider value
- Signup requests include valid JSON and expected fields
- Success and failure states both show user feedback
- Auth UI stays visible even when a child component throws
- Root cause is identified before patching the code

## Example investigation checklist

- Is `AuthProvider` mounted in the application root?
- Is `login` actually present in the context value?
- Does the endpoint return JSON for both success and error cases?
- Does the component handle `res.ok` and `!res.ok` separately?
- Does the auth area have an `ErrorBoundary` around it?

## Root cause found in this repo
The current issue is caused by the signup form depending on `AuthContext`, but the app does not mount `AuthProvider` anywhere in the tree. `SignupForm` calls `useContext(AuthContext)` and then accesses `login`, which is undefined if no provider is present. This can trigger a runtime exception during signup-related render logic. A small `ErrorBoundary` around the auth subtree would catch that failure and display a controlled fallback instead of crashing the entire view.

## Suggested prompts
- "Debug the signup form in the auth flow and identify the missing provider or render error."
- "Check why the signup component throws after submit and suggest a safe recovery strategy."
- "Add an error boundary around the auth section and explain how it prevents a full app crash."

## Related customizations
- Create a React component debugging prompt for provider and context issues
- Add a reusable `auth-error-boundary` instruction for app-level resiliency
- Create a generic `frontend-error-handling` skill for fetch and rendering failures
