# Architecture

## Design principles

cli-engine is built on four core principles:

### 1. Determinism

All functions in cli-engine are pure or deterministic. Given the same inputs, they always produce the same outputs. There are no hidden side effects, no global state, no ambient dependencies.

### 2. Dependency injection

All external operations are injected via interfaces:

- **FileSystem** - file reads, writes, directory operations
- **HttpClient** - HTTP requests
- **ShellExecutor** - command execution (array-based args prevent shell injection)
- **TokenProvider** - credential retrieval

This means cli-engine never imports `fs`, `fetch`, `child_process`, or reads environment variables directly.

### 3. Portability

Because all I/O is injected, the same logic runs in:

- **Bun/Node.js CLI** - the primary consumer
- **Browser** - with virtual file system and fetch
- **Tests** - with mock implementations
- **Serverless** - Cloudflare Workers, AWS Lambda, etc.

### 4. Security by design

- Shell commands use `execFile` with array-based args (no string interpolation)
- Tarball extraction validates against path traversal, absolute paths, and symlink attacks
- Integrity hashing (SHA256) for all artifact files

## Module dependency graph

```
EngineContext
├── core/interfaces     ← dependency injection contracts
├── categories          ← artifact component types
├── schemas             ← Zod validation (zero runtime deps)
├── constants           ← registry URLs, patterns
│
├── artifact            ← uses: fs, schemas, categories
│   ├── scanner         ← scan directories for components
│   ├── frontmatter     ← parse YAML frontmatter in .md files
│   ├── naming          ← artifact ID parsing, safe filenames
│   ├── integrity       ← SHA256 hashing, verification
│   └── lockfile        ← read/write grekt.lock
│
├── registry            ← uses: http, fs, shell, tokens
│   ├── sources         ← parse source strings (github:, gitlab:, registry)
│   ├── resolver        ← resolve scope → registry config
│   ├── factory         ← create appropriate RegistryClient
│   ├── download        ← tarball download + extraction
│   └── clients/        ← DefaultRegistry, GitHub (OCI), GitLab
│
├── sync                ← uses: fs, lockfile
│   ├── SyncPlugin      ← interface for target sync
│   └── constants       ← section markers, entry point text
│
├── artifactIndex       ← uses: schemas, categories
│   ├── generate        ← build index from artifacts
│   ├── serialize       ← minified text format
│   └── parse           ← deserialize index
│
├── oci                 ← uses: http
│   └── OciClient       ← OCI Distribution API client
│
├── version             ← pure semver utilities
├── formatters          ← pure display helpers
├── friendly-errors     ← YAML + Zod error formatting
└── workspace           ← monorepo discovery
```

## Data flow

### Install flow

```
source string → parseSource() → resolveRegistry() → createRegistryClient()
    → client.download() → downloadAndExtractTarball() → verifyIntegrity()
    → saveLockfile()
```

### Publish flow

```
scanArtifact() → validateManifest() → generateComponents()
    → hashDirectory() → calculateIntegrity()
    → client.publish()
```

### Sync flow

```
getLockfile() → SyncPlugin.sync() → read artifact files
    → write to target paths → generateIndex() → serializeIndex()
```

## Result types

cli-engine uses a discriminated union pattern for operations that can fail:

```typescript
type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: FriendlyError }
```

This is used consistently across config parsing, YAML parsing, and manifest validation. Always check `result.success` before accessing `result.data`.
