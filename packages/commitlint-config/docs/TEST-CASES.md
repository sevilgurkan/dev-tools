[comment]: # 'NOTE: This file is generated and should not be modify directly. Use `pnpm run generate:test-docs` instead'

# Commit Message Test Cases

This document contains test cases for commit message validation rules.

It is automatically generated using [generate-test-docs.ts](https://github.com/sevilgurkan/dev-tools/blob/main/packages/commitlint-config/scripts/generate-test-docs.ts).

## type-enum

| Severity | When   | Value                                                                    |
| :------- | :----- | :----------------------------------------------------------------------- |
| Error    | always | chore,build,ci,docs,feat,fix,perf,refactor,revert,style,test,release,ops |

### Messages

```shell
✅ feat: new feature

❌ random: invalid type

❌ FIX: valid type wrong case
```

## type-empty

| Severity | When  | Value |
| :------- | :---- | :---- |
| Error    | never | -     |

### Messages

```shell
✅ feat: add new feature

✅ feat(scope): add new feature

❌ : missing type

❌ feat(): empty scope but valid type
```

## type-case

| Severity | When   | Value      |
| :------- | :----- | :--------- |
| Error    | always | lower-case |

### Messages

```shell
✅ feat: message

❌ Feat: message
```

## scope-case

| Severity | When  | Value      |
| :------- | :---- | :--------- |
| Error    | never | upper-case |

### Options

```json
{
  "additionalScopes": ["k8s", "workflow"]
}
```

### Messages

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

| Severity | When   | Value       |
| :------- | :----- | :---------- |
| Error    | always | auth,docker |

### Options

```json
{
  "additionalScopes": ["auth", "docker"]
}
```

### Messages

```shell
✅ feat: add new feature

✅ fix(auth): google provider

✅ feat(docker): add new feature

❌ docs(scope): update readme
```

## scope-empty

| Severity | When  | Value |
| :------- | :---- | :---- |
| Warning  | never | -     |

### Options

```json
{
  "additionalScopes": ["docs-infra", "core"]
}
```

### Messages

```shell
✅ feat(docs-infra): add new feature

✅ test(core): message

✅ ci: message

❌ feat(): empty scope

❌ feat( ): space in parentheses
```

## subject-empty

| Severity | When  | Value |
| :------- | :---- | :---- |
| Error    | never | -     |

### Messages

```shell
✅ feat: add new feature

❌ feat:

❌ feat:
```

## subject-case

| Severity | When  | Value      |
| :------- | :---- | :--------- |
| Error    | never | upper-case |

### Messages

```shell
✅ chore: add new feature

✅ refactor: MixeD sUbJEcT CASE

❌ docs: UPPERCASE SUBJECT
```

## subject-full-stop

| Severity | When  | Value |
| :------- | :---- | :---- |
| Error    | never | .     |

### Messages

```shell
✅ feat: message

❌ feat: message.
```

## body-leading-blank

| Severity | When   | Value |
| :------- | :----- | :---- |
| Error    | always | -     |

### Messages

```shell
✅ feat: message

body text

❌ feat: message
body without blank

❌ feat: message

body with space line
```

## body-case

| Severity | When  | Value      |
| :------- | :---- | :--------- |
| Error    | never | upper-case |

### Messages

```shell
✅ feat: message

body text

❌ feat: message
BODY TEXT
```

## body-max-line-length

| Severity | When   | Value |
| :------- | :----- | :---- |
| Error    | always | 100   |

### Messages

```shell
✅ feat: message

short body

❌ feat: message

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

❌ feat: message

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
```

## body-full-stop

| Severity | When  | Value |
| :------- | :---- | :---- |
| Error    | never | .     |

### Messages

```shell
✅ feat: message

body text

❌ feat: message

body text.
```

## references-empty

| Severity | When  | Value |
| :------- | :---- | :---- |
| Error    | never | -     |

### Options

```json
{
  "requireJira": true
}
```

### Messages

```shell
✅ feat: JIRA-123 message

✅ test: JIRA-123 JIRA-45Ab JIRA-7Gh22 message

❌ docs: message without reference

❌ style: INVALID-REF-21 message

❌ style: ASD-43 YG-4 message
```

## header-max-length

| Severity | When   | Value |
| :------- | :----- | :---- |
| Error    | always | 100   |

### Messages

```shell
✅ docs: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt

✅ feat: message

short body

❌ feat: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

❌ feat: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
```

## header-trim

| Severity | When   | Value |
| :------- | :----- | :---- |
| Error    | always | -     |

### Messages

```shell
✅ feat: message

short body

✅ docs: message

   body text

✅ perf: message

body text

❌  docs: message

❌ docs: message

❌  docs: message
```

## scope-empty-parentheses

| Severity | When   | Value |
| :------- | :----- | :---- |
| Error    | always | -     |

### Messages

```shell
✅ feat: without scope

❌ feat(: message

❌ feat): message

❌ feat(): message

❌ feat( ): space in scope
```

## jira-issue-key-empty

| Severity | When   | Value |
| :------- | :----- | :---- |
| Error    | always | -     |

### Options

```json
{
  "requireJira": true
}
```

### Messages

```shell
✅ feat: JIRA-123 message

✅ feat: JIRA-11bc JIRA-22 message

✅ feat: JIRA-54yC JIRA-22GHF JIRA-33c message

✅ feat: JIRA-992 message

another message for JIRA-632

✅ feat: JIRA-15362 message

JIRA-99Hz

JIRA-QW23

❌ feat: JIRA566 message

❌ feat: JIRA- message

❌ feat: JIRA566 jiRA253 jira-253 JIRA- message

❌ feat: JIRA-ABC 263-JIRA message

❌ feat: message

JIRA22 message

❌ feat: message

JIRA22 jiRa-53 JIRA- message
```
