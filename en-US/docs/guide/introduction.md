# Introduction

`@grekt-labs/cli-engine` is the deterministic core logic library that powers grekt. It contains all the business logic for artifact management (scanning, parsing, registry operations, syncing, versioning, and more) without performing any I/O directly.

## Why cli-engine?

The engine is designed around a key principle: **determinism through dependency injection**. All external operations (file system, HTTP, shell commands) are injected via interfaces. This means:

- **Same inputs always produce the same outputs.** No hidden side effects
- **Runs anywhere.** CLI, browser, test environments, serverless functions
- **Easy to test.** Swap real implementations with mocks
- **Easy to extend.** Implement the interfaces for your platform

## Who is this for?

This is internal documentation for grekt contributors and maintainers:

- **Understanding the architecture** - how cli-engine is structured and why
- **Contributing** - interfaces, contracts, and patterns to follow when adding features
- **Reference** - schemas, modules, and import paths for day-to-day development
- **Debugging** - how the pieces fit together when tracking down issues

## Module overview

| Module | Purpose |
|--------|---------|
| [Core interfaces](/en-US/docs/core/interfaces) | Dependency injection contracts |
| [EngineContext](/en-US/docs/core/engine-context) | Unified context object |
| [Categories](/en-US/docs/core/categories) | Artifact component type definitions |
| [Schemas](/en-US/docs/modules/schemas) | Zod validation schemas and inferred types |
| [Artifact](/en-US/docs/modules/artifact) | Scanner, frontmatter, naming, integrity |
| [Registry](/en-US/docs/modules/registry) | Source parsing, resolution, clients |
| [Sync](/en-US/docs/modules/sync) | SyncPlugin interface, constants |
| [Artifact index](/en-US/docs/modules/artifact-index) | Index generation for lazy loading |
| [OCI](/en-US/docs/modules/oci) | OCI Distribution client (GHCR) |
| [Version](/en-US/docs/modules/version) | Semver utilities |
| [Formatters](/en-US/docs/modules/formatters) | Display formatting helpers |
| [Friendly errors](/en-US/docs/modules/friendly-errors) | YAML + Zod error reporting |

## Import paths

Everything is exported from the main entry point:

```typescript
import {
  FileSystem,
  EngineContext,
  CATEGORIES,
  CATEGORY_CONFIG,
  ArtifactManifestSchema,
  scanArtifact,
  parseSource,
  createRegistryClient,
  formatBytes,
  estimateTokens,
  safeParseYaml,
} from '@grekt-labs/cli-engine'
```
