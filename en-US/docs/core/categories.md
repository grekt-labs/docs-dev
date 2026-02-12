# Categories

Categories define the types of components that an artifact can contain. They are the central definition point. Add a category here and it propagates throughout the entire engine.

## CATEGORIES

The complete list of artifact component types:

```typescript
const CATEGORIES = ["agents", "skills", "commands", "mcps", "rules", "hooks"] as const

type Category = (typeof CATEGORIES)[number]
```

## CATEGORY_CONFIG

Each category has associated configuration:

```typescript
type FileFormat = "md" | "json"

interface CategoryConfig {
  singular: string
  defaultPath: string
  allowedFormats: FileFormat[]
}

const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  agents:   { singular: "agent",   defaultPath: "agents",   allowedFormats: ["md"] },
  skills:   { singular: "skill",   defaultPath: "skills",   allowedFormats: ["md"] },
  commands: { singular: "command", defaultPath: "commands", allowedFormats: ["md"] },
  mcps:     { singular: "mcp",     defaultPath: "mcps",     allowedFormats: ["json"] },
  rules:    { singular: "rule",    defaultPath: "rules",    allowedFormats: ["md"] },
  hooks:    { singular: "hook",    defaultPath: "hooks",    allowedFormats: ["json"] },
}
```

| Category | Format | Description |
|----------|--------|-------------|
| `agents` | Markdown | AI agent definitions |
| `skills` | Markdown | Reusable skill prompts |
| `commands` | Markdown | Command definitions |
| `mcps` | JSON | MCP server configurations |
| `rules` | Markdown | AI behavior rules |
| `hooks` | JSON | Hook configurations |

## Utility functions

### isValidCategory

```typescript
function isValidCategory(value: string): value is Category
```

Type guard that checks if a string is a valid category name.

### getCategoriesForFormat

```typescript
function getCategoriesForFormat(format: FileFormat): Category[]
```

Returns all categories that use a given file format. For example, `getCategoriesForFormat("md")` returns `["agents", "skills", "commands", "rules"]`.

### getSingular

```typescript
function getSingular(category: Category): string
```

Returns the singular form of a category name. `getSingular("agents")` returns `"agent"`.

### getDefaultPath

```typescript
function getDefaultPath(category: Category): string
```

Returns the default directory path for a category. `getDefaultPath("skills")` returns `"skills"`.

### createCategoryRecord

```typescript
function createCategoryRecord<T>(defaultValue: () => T): Record<Category, T>
```

Creates a record with an entry for every category, initialized with the given factory function:

```typescript
const counts = createCategoryRecord(() => 0)
// { agents: 0, skills: 0, commands: 0, mcps: 0, rules: 0, hooks: 0 }

const lists = createCategoryRecord<string[]>(() => [])
// { agents: [], skills: [], commands: [], ... }
```
