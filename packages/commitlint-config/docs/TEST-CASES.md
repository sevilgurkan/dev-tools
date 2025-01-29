[comment]: # 'NOTE: This file is generated and should not be modify directly. Use `pnpm run generate:test-docs` instead'

# Commit Message Test Cases

This document contains test cases for commit message validation rules.

It is automatically generated using [generate-test-docs.ts](https://github.com/sevilgurkan/dev-tools/blob/main/packages/commitlint-config/scripts/generate-test-docs.ts).

## type-enum

Commit must use standard types like feat, fix, docs, etc.

| Severity | When   | Value                                                                    |
| :------- | :----- | :----------------------------------------------------------------------- |
| Error    | always | chore,build,ci,docs,feat,fix,perf,refactor,revert,style,test,release,ops |

#### Messages

```shell
✅ feat: new feature

✅ fix: auth provider

✅ docs: update readme

✅ perf: optimize performance

❌ random: invalid type

❌ FIX: valid type with wrong case

❌ e: invalid type
```

## type-empty

A type followed by a colon is mandatory.

| Severity | When  | Value |
| :------- | :---- | :---- |
| Error    | never | -     |

#### Messages

```shell
✅ feat: add new feature

✅ feat(scope): add new feature

❌ : missing type

❌ feat(): empty scope but valid type
```

## type-case

All commit types should be lowercase.

| Severity | When   | Value      |
| :------- | :----- | :--------- |
| Error    | always | lower-case |

#### Messages

```shell
✅ feat: message

✅ perf: optimize performance

❌ Feat: capitalize

❌ fEaT: mixed case

❌ FEAT: uppercase
```

## scope-case

Scope text must follow lowercase format.

| Severity | When  | Value      |
| :------- | :---- | :--------- |
| Error    | never | upper-case |

#### Options

```json
{
  "additionalScopes": ["k8s", "workflow"]
}
```

#### Messages

```shell
✅ feat(k8s): pipeline

✅ ci(workflow): pipeline

❌ feat(WORKFLOW): uppercase scope

❌ feat(K8S): mixed case scope

❌ feat(Workflow): message

❌ feat(WoRKfLOw): mix scope

❌ feat(another-scope): message
```

## scope-enum

Only allowed scope values are accepted.

| Severity | When   | Value       |
| :------- | :----- | :---------- |
| Error    | always | auth,docker |

#### Options

```json
{
  "additionalScopes": ["auth", "docker"]
}
```

#### Messages

```shell
✅ feat: add new feature

✅ fix(auth): google provider

✅ feat(docker): add new feature

❌ docs(scope): update readme
```

## scope-empty

When scope is used, it must contain a valid value.

| Severity | When  | Value |
| :------- | :---- | :---- |
| Warning  | never | -     |

#### Options

```json
{
  "additionalScopes": ["docs-infra", "core"]
}
```

#### Messages

```shell
✅ feat(docs-infra): add new feature

✅ test(core): message

✅ ci: message with empty scope

❌ feat(invalid-scope): message with invalid scope

❌ feat(random): message
```

## scope-empty-parentheses

Proper scope syntax without empty brackets.

| Severity | When   | Value |
| :------- | :----- | :---- |
| Error    | always | -     |

#### Messages

```shell
✅ feat: without scope

❌ feat(: message

❌ feat): message

❌ feat(): message

❌ feat( ): space in scope
```

## subject-empty

Commit message requires a meaningful subject.

| Severity | When  | Value |
| :------- | :---- | :---- |
| Error    | never | -     |

#### Messages

```shell
✅ feat: add new feature

❌ feat:

❌ feat:
```

## subject-case

Avoids fully capitalized subject lines.

| Severity | When  | Value      |
| :------- | :---- | :--------- |
| Error    | never | upper-case |

#### Messages

```shell
✅ chore: add new feature

✅ refactor: MixeD sUbJEcT CASE

❌ docs: UPPERCASE SUBJECT
```

## subject-full-stop

No period at the end of subject line.

| Severity | When  | Value |
| :------- | :---- | :---- |
| Error    | never | .     |

#### Messages

```shell
✅ feat: message

❌ feat: message.
```

## body-leading-blank

Requires space between subject and body.

| Severity | When   | Value |
| :------- | :----- | :---- |
| Error    | always | -     |

#### Messages

```shell
✅ feat: message

body text

❌ feat: message
body without blank
```

## body-case

Body text should not be all uppercase.

| Severity | When  | Value      |
| :------- | :---- | :--------- |
| Error    | never | upper-case |

#### Messages

```shell
✅ feat: message

body text

❌ feat: message
BODY TEXT
```

## body-max-line-length

Keeps body lines within readable length.

| Severity | When   | Value |
| :------- | :----- | :---- |
| Error    | always | 100   |

#### Messages

```shell
✅ feat: message

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmo

❌ feat: message

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

❌ fix(infra): message

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
```

## body-full-stop

No period at the end of body text.

| Severity | When  | Value |
| :------- | :---- | :---- |
| Error    | never | .     |

#### Messages

```shell
✅ feat: message

body text

❌ feat: message

body text.
```

## references-empty

Checks for required JIRA issue references.

| Severity | When  | Value |
| :------- | :---- | :---- |
| Error    | never | -     |

#### Options

```json
{
  "requireJira": true
}
```

#### Messages

```shell
✅ feat: JIRA-123 message

✅ test: JIRA-123 JIRA-45Ab JIRA-7Gh22 message

❌ docs: message without reference

❌ style: INVALID-REF-21 message

❌ style: ASD-43 YG-4 message
```

## header-max-length

Maintains readable header length.

| Severity | When   | Value |
| :------- | :----- | :---- |
| Error    | always | 100   |

#### Messages

```shell
✅ docs: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmo

❌ feat: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
```

## header-trim

No extra spaces around header text.

| Severity | When   | Value |
| :------- | :----- | :---- |
| Error    | always | -     |

#### Messages

```shell
✅ feat: message

✅ docs: message

✅ perf: message

❌  docs: message

❌   docs: message

❌     docs: message
```

## jira-issue-key-empty

Valid JIRA issue format (JIRA-XXX) required.

| Severity | When   | Value |
| :------- | :----- | :---- |
| Error    | always | -     |

#### Options

```json
{
  "requireJira": true
}
```

#### Messages

```shell
✅ feat: JIRA-123 message

✅ feat: JIRA-11bc JIRA-22 message

✅ feat: JIRA-54yC JIRA-22GHF JIRA-33c message

✅ feat: JIRA-992 message

another body message for JIRA-632

✅ feat: JIRA-15362 message

body JIRA-99Hz

footer JIRA-QW23

❌ feat: JIRA566 message

❌ feat: JIRA- message

❌ feat: JIRA566 jiRA253 jira-253 JIRA- message

❌ feat: JIRA-ABC 263-JIRA message

❌ feat: message

body JIRA22 message

❌ feat: message

body JIRA22 jiRa-53 JIRA- message
```
