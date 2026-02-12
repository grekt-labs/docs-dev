# Schemas

All types in cli-engine are inferred from Zod schemas. This ensures runtime validation matches TypeScript types exactly.

## Primitive schemas

### SemverSchema

```typescript
const SemverSchema = z.string().refine(isValidSemver)
```

Validates strict semver strings. Rejects `v`-prefixed versions (`v1.0.0` is invalid, `1.0.0` is valid).

### KeywordSchema / KeywordsSchema

```typescript
const KeywordSchema = z.string().trim().min(1)
const KeywordsSchema = z.array(KeywordSchema)
const KeywordsPublishSchema = KeywordsSchema.min(3).max(5)
```

Keywords are trimmed, non-empty strings. Publishing requires 3-5 keywords.

## ArtifactManifest

The manifest inside an artifact directory (`grekt.yaml`):

```typescript
interface ArtifactManifest {
  name: string          // @scope/name (scoped required for publishing)
  author?: string       // Optional, credits only
  version: string       // Valid semver
  description: string
  keywords?: string[]
  private?: boolean
  license?: string
  repository?: string   // Must be a URL
  components?: Components  // Auto-generated during publish/pack
}
```

## ArtifactFrontmatter

YAML frontmatter in markdown artifact files (`.md`):

```typescript
interface ArtifactFrontmatter {
  "grk-type": Category       // agents, skills, commands, mcps, rules, hooks
  "grk-name": string
  "grk-description": string
  "grk-agents"?: string      // For skills/commands belonging to an agent
}
```

## ProjectConfig

Project-level configuration (`grekt.yaml` in a project consuming artifacts):

```typescript
interface ProjectConfig {
  // Manifest fields (for publishing)
  name?: string
  author?: string
  version?: string
  description?: string
  keywords?: string[]
  license?: string
  repository?: string

  // Config fields (for consuming)
  targets: string[]                              // default: []
  registry?: string
  artifacts: Record<string, ArtifactEntry>       // default: {}
  customTargets: Record<string, CustomTarget>    // default: {}
}
```

### ArtifactEntry

An artifact entry can be a simple version string or a detailed object:

```typescript
type ArtifactEntry = string | {
  version: string
  mode: "core" | "lazy"     // default: "lazy"
  agents?: string[]          // Array of component paths
  skills?: string[]
  commands?: string[]
  mcps?: string[]
  rules?: string[]
  hooks?: string[]
}
```

When a string is provided (e.g., `"1.0.0"`), all components are included in lazy mode.

### CustomTarget

```typescript
interface CustomTarget {
  name: string
  contextEntryPoint: string
  paths?: ComponentPaths     // Optional custom paths per category
}
```

## Lockfile

The lockfile tracks installed artifact state:

```typescript
interface Lockfile {
  version: 1
  artifacts: Record<string, LockfileEntry>
}

interface LockfileEntry {
  version: string          // Semver
  integrity: string        // SHA256 hash of entire artifact
  source?: string
  resolved?: string        // Full URL (immutable after write)
  mode: "core" | "lazy"   // default: "lazy"
  files: Record<string, string>  // Per-file hashes: { "agent.md": "sha256:abc..." }
}
```

## RegistryEntry

Registry configuration in `grekt.local.yaml`:

```typescript
interface RegistryEntry {
  type: "gitlab" | "github" | "default"
  project?: string     // Required for gitlab/github
  host?: string        // Optional, has defaults
  token?: string
  prefix?: string      // Package name prefix
}
```

## LocalConfig

Local (gitignored) configuration:

```typescript
interface LocalConfig {
  registries?: Record<string, RegistryEntry>  // Scope must start with @
  session?: StoredSession                      // Public registry auth
  tokens?: Tokens                              // Git source tokens
}
```

## ArtifactIndex

Index for lazy-loaded artifacts:

```typescript
interface ArtifactIndex {
  version: 1
  entries: IndexEntry[]
}

interface IndexEntry {
  artifactId: string    // @scope/name
  keywords: string[]
  mode: ArtifactMode    // core or lazy
}
```
