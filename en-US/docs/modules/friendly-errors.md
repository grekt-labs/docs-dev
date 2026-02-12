# Friendly errors

The friendly errors module provides user-friendly error reporting for YAML parsing and Zod schema validation. It is **mandatory** for all config file parsing in cli-engine.

## safeParseYaml

```typescript
function safeParseYaml<Output, Input = Output>(
  content: string,
  schema: ZodType<Output, ZodTypeDef, Input>,
  filepath?: string
): ParseResult<Output>
```

Parses a YAML string and validates it against a Zod schema. Returns a `ParseResult` with human-readable error messages.

### Usage

```typescript
import { safeParseYaml } from '@grekt-labs/cli-engine/friendly-errors'
import { ProjectConfigSchema } from '@grekt-labs/cli-engine/schemas'

const content = fs.readFile("grekt.yaml")
const result = safeParseYaml(content, ProjectConfigSchema, "grekt.yaml")

if (!result.success) {
  console.error(result.error.message)
  result.error.details?.forEach(detail => {
    console.error(`  ${detail}`)
  })
  return
}

// result.data is typed as ProjectConfig
const config = result.data
```

## ParseResult

```typescript
type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: FriendlyError }
```

## FriendlyError

```typescript
type ParseErrorType = "yaml" | "validation"

interface FriendlyError {
  type: ParseErrorType
  message: string
  details?: string[]
}
```

| Error type | When | Example message |
|-----------|------|-----------------|
| `yaml` | YAML syntax is invalid | "Invalid YAML in grekt.yaml" |
| `validation` | YAML is valid but fails schema | "Validation error in grekt.yaml" with field-level details |

## Why use this?

Direct Zod validation errors are cryptic for end users. `safeParseYaml` transforms them into actionable messages with:

- The filename where the error occurred
- Clear distinction between syntax errors and validation errors
- Detailed field-level messages for validation failures
